/* eslint-disable import/no-extraneous-dependencies */
import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'

import { getProvider } from "./provider";
import { getTags } from './tags'

export function createBucket(): aws.s3.Bucket {
  const provider = getProvider()
  const tags = getTags()
  const stack = pulumi.getStack()
  const project = pulumi.getProject()

  const siteBucket = new aws.s3.Bucket(
    's3BucketWeb',
    {
      acl: 'private',
      bucket: `${project}-${stack}`,
      tags,
    },
    { provider }
  )
  return siteBucket
}
