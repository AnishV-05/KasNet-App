import { createCloudfrontDistribution } from './resources/cloudfront'
import { createBucket } from './resources/s3'
// import { createWebAcl } from './resources/waf'

const bucket = createBucket()
// const waf = createWebAcl()
const distribution = createCloudfrontDistribution(bucket)

export const distributionDns = distribution.domainName
export const distributionId = distribution.id
export const bucketName = bucket.bucket
