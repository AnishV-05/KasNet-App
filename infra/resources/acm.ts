import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

import { CreateCertificateRecord } from './route53';
import { getProvider } from './provider';
import { getTags } from './tags';
import Constants from '../constants';

const provider = getProvider();
const tags = getTags();

export function CreateCertificate(): pulumi.Output<string> {
    return pulumi.output(aws.acm.getCertificate({
        domain: Constants.customDomain,
        statuses: ["ISSUED"],
        mostRecent: true,
    }, {
        provider
    }).then(existingCert => {
        return existingCert.arn;
    }).catch(() => {
        const cert = new aws.acm.Certificate("acmCert", {
            domainName: Constants.customDomain,
            subjectAlternativeNames: [`*.${Constants.customDomain}`],
            validationMethod: "DNS",
            tags: tags,
        }, { provider });

        const validationOptions = cert.domainValidationOptions.apply(options => options[0]);

        const validationRecord = CreateCertificateRecord(validationOptions);

        const certificateValidation = new aws.acm.CertificateValidation("certificateValidation", {
            certificateArn: cert.arn,
            validationRecordFqdns: [validationRecord.fqdn],
        }, { provider });

        return certificateValidation.certificateArn;
    }));
}
