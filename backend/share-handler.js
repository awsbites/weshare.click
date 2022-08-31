import { Metrics, logMetrics, MetricUnits } from '@aws-lambda-powertools/metrics'
import { Tracer, captureLambdaHandler } from '@aws-lambda-powertools/tracer'
import { Logger, injectLambdaContext } from '@aws-lambda-powertools/logger'
import middy from '@middy/core'
import httpContentNegotiation from '@middy/http-content-negotiation'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'node:crypto'

const { BUCKET_NAME, BASE_URL } = process.env
const EXPIRY_DEFAULT = 24 * 60 * 60
const MIME_TYPE = 'application/octet-stream'

const tracer = new Tracer()
const logger = new Logger()
const metrics = new Metrics()
const s3Client = new S3Client()

async function handler (event, context) {
  // Create a key (file name)
  const id = randomUUID()
  const key = `shares/${id[0]}/${id[1]}/${id}`

  const filename = event?.queryStringParameters?.filename
  const contentDisposition = `attachment; filename="${filename}"`
  const contentDispositionHeader = contentDisposition && `content-disposition: ${contentDisposition}`

  logger.info('Creating share', { id, key, filename, contentDispositionHeader })
  metrics.addMetric('createShare', MetricUnits.Count, 1)

  // Create the download URL
  const downloadUrl = `${BASE_URL}/share/${id}`

  // Create an upload URL
  const putCommand = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentDisposition: contentDisposition
  })

  const signableHeaders = new Set([`content-type: ${MIME_TYPE}`])
  if (contentDisposition) {
    signableHeaders.add(contentDispositionHeader)
  }

  const uploadUrl = await getSignedUrl(
    s3Client, putCommand, {
      expiresIn: EXPIRY_DEFAULT,
      signableHeaders
    }
  )

  let headers = {
    'content-type': 'text/plain'
  }

  let body = `
  Upload with: curl -X PUT -T ${filename || '<FILENAME>'} ${contentDispositionHeader ? `-H '${contentDispositionHeader}'` : ''} '${uploadUrl}' 
  
  Download with: curl ${downloadUrl}
  `

  if (event.preferredMediaType === 'application/json') {
    body = JSON.stringify({
      filename,
      headers: [contentDispositionHeader],
      uploadUrl,
      downloadUrl
    })
    headers = {
      'content-type': 'application/json'
    }
  }

  return {
    statusCode: 201,
    headers,
    body
  }
}

export const handleEvent = middy(handler)
  .use(injectLambdaContext(logger, { logEvents: true }))
  .use(logMetrics(metrics))
  .use(captureLambdaHandler(tracer))
  .use(httpHeaderNormalizer())
  .use(httpContentNegotiation({
    parseCharsets: false,
    parseEncodings: false,
    parseLanguages: false,
    failOnMismatch: false,
    availableMediaTypes: ['text/plain', 'application/json']
  }))
