import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'
import Constants from '../constants'

import { getProvider } from './provider'
import { getTags } from './tags'
import { CreateCertificate } from './acm'
import { CreateSubDomainRecord } from './route53'

const tags = getTags()
const stack = pulumi.getStack()
const project = pulumi.getProject()
const provider = getProvider()

let viewerCertificateValue: pulumi.Input<aws.types.input.cloudfront.DistributionViewerCertificate> = {
  cloudfrontDefaultCertificate: true,
}

if (Constants.useCustomDomain) {
  const cert = CreateCertificate()

  viewerCertificateValue = {
    cloudfrontDefaultCertificate: false,
    acmCertificateArn: cert,
    sslSupportMethod: 'sni-only',
    minimumProtocolVersion: 'TLSv1.2_2021',
  }
}

function publicReadPolicyForBucket(bucketName: string, distributionArn: string) {
  return JSON.stringify({
    Statement: [
      {
        Action: ['s3:GetObject'],
        Condition: {
          StringEquals: {
            'AWS:SourceArn': distributionArn,
          },
        },
        Effect: 'Allow',
        Principal: {
          Service: 'cloudfront.amazonaws.com',
        },
        Resource: [`arn:aws:s3:::${bucketName}/*`],
      },
    ],
    Version: '2008-10-17',
  })
}

export function createCloudfrontDistribution(
  bucket: aws.s3.Bucket,
  waf?: aws.wafv2.WebAcl
): aws.cloudfront.Distribution {
  const originAccessControl = new aws.cloudfront.OriginAccessControl(
    'origin-access-control',
    {
      description: 'Web policy',
      originAccessControlOriginType: 's3',
      signingBehavior: 'always',
      signingProtocol: 'sigv4',
    },
    { provider }
  )

  const cloudFrontFunction = new aws.cloudfront.Function(
    `${project}-${stack}-cloudfront-function`,
    {
      code: `
      function handler(event) {
        var request = event.request;
        if (request.querystring.platform) {
          request.uri = '/outputs/' + request.querystring.platform.value + '/remotes' + request.uri
        }
        return request;
      }`,
      comment: `${project}-${stack}`,
      name: `${project}-${stack}-cloudfront-function`,
      publish: true,
      runtime: 'cloudfront-js-1.0',
    },
    { provider }
  )

  const distribution = new aws.cloudfront.Distribution(
    'distribution',
    {
      aliases: Constants.useCustomDomain ? [`${Constants.customSubDomain}.${Constants.customDomain}`] : undefined,
      comment: `${project}-${stack}`,
      customErrorResponses: [
        {
          errorCode: 403,
          errorCachingMinTtl: 10,
          responseCode: 200,
          responsePagePath: "/index.html",
        },
        {
          errorCode: 404,
          errorCachingMinTtl: 10,
          responseCode: 200,
          responsePagePath: "/index.html",
        },
      ],
      defaultCacheBehavior: {
        allowedMethods: ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'],
        cachedMethods: ['GET', 'HEAD'],
        defaultTtl: 3600,
        forwardedValues: {
          cookies: {
            forward: 'none',
          },
          queryString: false,
        },
        functionAssociations: [
          {
            eventType: 'viewer-request',
            functionArn: cloudFrontFunction.arn,
          },
        ],
        maxTtl: 86400,
        minTtl: 0,
        targetOriginId: bucket.arn,
        viewerProtocolPolicy: 'redirect-to-https',
      },
      defaultRootObject: 'index.html',
      enabled: true,
      isIpv6Enabled: true,
      origins: [
        {
          domainName: bucket.bucketRegionalDomainName,
          originAccessControlId: originAccessControl.id,
          originId: bucket.arn,
        },
      ],
      restrictions: {
        geoRestriction: {
          restrictionType: 'none',
        },
      },
      tags,
      viewerCertificate: viewerCertificateValue,
      webAclId: waf?.arn
    },
    { dependsOn: [cloudFrontFunction], provider }
  )

  CreateSubDomainRecord(distribution)

  const policyDocument = pulumi
    .all([bucket.bucket, distribution.arn])
    .apply(([bucketName, distributionArn]) => publicReadPolicyForBucket(bucketName, distributionArn))

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const bucketPolicy = new aws.s3.BucketPolicy(
    'bucket-policy',
    {
      bucket: bucket.bucket,
      policy: policyDocument,
    },
    { provider }
  )

  return distribution
}
