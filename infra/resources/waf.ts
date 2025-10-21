/* eslint-disable import/no-extraneous-dependencies */
import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'

import { getProvider } from "./provider";

const provider = getProvider()
const stack = pulumi.getStack()
const project = pulumi.getProject()

export function createWebAcl(): aws.wafv2.WebAcl {
  return new aws.wafv2.WebAcl(
    'wafAcl',
    {
      defaultAction: {
        allow: {},
      },
      description: `${project}-${stack}`,
      name: `${project}-${stack}-waf`,
      rules: [
        {
          name: `AWS-AWSManagedRulesAmazonIpReputationList`,
          overrideAction: {
            none: {},
          },
          priority: 0,
          statement: {
            managedRuleGroupStatement: {
              name: 'AWSManagedRulesAmazonIpReputationList',
              vendorName: 'AWS',
            },
          },
          visibilityConfig: {
            cloudwatchMetricsEnabled: true,
            metricName: 'MetricForAMRAIRL',
            sampledRequestsEnabled: true,
          },
        },
        {
          name: `AWS-AWSManagedRulesCommonRuleSet`,
          overrideAction: {
            none: {},
          },
          priority: 1,
          statement: {
            managedRuleGroupStatement: {
              name: 'AWSManagedRulesCommonRuleSet',
              vendorName: 'AWS',
            },
          },
          visibilityConfig: {
            cloudwatchMetricsEnabled: true,
            metricName: 'MetricForAMRCRS',
            sampledRequestsEnabled: true,
          },
        },
        {
          name: `AWS-AWSManagedRulesLinuxRuleSet`,
          overrideAction: {
            none: {},
          },
          priority: 2,
          statement: {
            managedRuleGroupStatement: {
              name: 'AWSManagedRulesLinuxRuleSet',
              vendorName: 'AWS',
            },
          },
          visibilityConfig: {
            cloudwatchMetricsEnabled: true,
            metricName: 'MetricForAMRLRS',
            sampledRequestsEnabled: true,
          },
        },
        {
          name: `AWS-AWSManagedRulesPHPRuleSet`,
          overrideAction: {
            none: {},
          },
          priority: 3,
          statement: {
            managedRuleGroupStatement: {
              name: 'AWSManagedRulesPHPRuleSet',
              vendorName: 'AWS',
            },
          },
          visibilityConfig: {
            cloudwatchMetricsEnabled: true,
            metricName: 'MetricForAMRPRS',
            sampledRequestsEnabled: true,
          },
        },
        {
          action: {
            block: {}, // Block the request if XSS is detected
          },
          name: 'XSSRule',
          priority: 4,
          statement: {
            xssMatchStatement: {
              fieldToMatch: {
                headers: [
                  {
                    matchPattern: {
                      all: {},
                    },
                    matchScope: 'ALL',
                    oversizeHandling: 'MATCH',
                  },
                ],
              },
              textTransformations: [
                {
                  priority: 4,
                  type: 'NONE', // Decode URL-encoded parts of the request before inspecting
                },
              ],
            },
          },
          visibilityConfig: {
            cloudwatchMetricsEnabled: true,
            metricName: 'xssRule',
            sampledRequestsEnabled: true, // Enable logging of sampled requests for further analysis
          },
        },
        {
          action: {
            block: {},
          },
          name: 'GeoMatchKasnet',
          priority: 5,
          statement: {
            geoMatchStatement: {
              countryCodes: ['RU'],
            },
          },
          visibilityConfig: {
            cloudwatchMetricsEnabled: true,
            metricName: 'GeoMatchKasnet',
            sampledRequestsEnabled: true,
          },
        },
      ],
      scope: 'CLOUDFRONT',
      visibilityConfig: {
        cloudwatchMetricsEnabled: true,
        metricName: 'waf-kasnet',
        sampledRequestsEnabled: true,
      },
    },
    { provider }
  )
}
