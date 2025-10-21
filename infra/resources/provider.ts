import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

const awsConfig = new pulumi.Config('aws');
const assumeRole = awsConfig.require('assumeRole');
const sessionName = awsConfig.require('sessionName');
const region = aws.config.requireRegion();
const stack = pulumi.getStack();
const providerName = awsConfig.require('providerName');

let provider: aws.Provider;

export function getProvider() {
  if (provider) return provider;

  provider =
    stack === 'sandbox'
      ? new aws.Provider(providerName, {
          region,
        })
      : new aws.Provider(providerName, {
          assumeRole: {
            roleArn: assumeRole,
            sessionName,
          },
          region,
        });

  return provider;
}
