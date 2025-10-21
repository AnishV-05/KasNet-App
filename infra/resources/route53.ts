import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

import { getTags } from './tags';
import Constants from '../constants';

const tags = getTags();

// Enter the details of the account where the domain exists
const region = aws.config.requireRegion();

const domainProvider = new aws.Provider("domainProviderName", {
    assumeRole: {
        roleArn: `${Constants.domainAssumeRole}`,
        sessionName: "domainSessionName",
    },
    region,
});

const zone = aws.route53.getZone(
    { name: `${Constants.customDomain}.` },
    { provider: domainProvider }
);

export function CreateCertificateRecord(
    validationOptions: pulumi.Output<aws.types.output.acm.CertificateDomainValidationOption>
): aws.route53.Record {
    const validationRecord = new aws.route53.Record("validationRecord", {
        zoneId: zone.then(zone => zone.id),
        name: validationOptions.resourceRecordName,
        type: validationOptions.resourceRecordType,
        records: [validationOptions.resourceRecordValue],
        ttl: 300,
    }, { provider: domainProvider });

    return validationRecord
}

export function CreateSubDomainRecord(customDomain: aws.cloudfront.Distribution): aws.route53.Record {
    const record = new aws.route53.Record("subDomainRecord", {
        zoneId: zone.then(zone => zone.id),
        name: `${Constants.customSubDomain}.${Constants.customDomain}`,
        type: "A",
        aliases: [{
            name: customDomain.domainName ,
            zoneId: customDomain.hostedZoneId,
            evaluateTargetHealth: false,
        }],
    }, { provider: domainProvider });

    return record;
}