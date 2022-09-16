import tap from 'tap'
import esmock from 'esmock'
import sinon from 'sinon'

const FIXED_UUID = '00000000-0000-0000-0000-000000000000'
const mockMiddleware = () => ({ before: sinon.stub(), after: sinon.stub(), error: sinon.stub() })
process.env.BUCKET_NAME = 'test-bucket'
process.env.BASE_URL = 'https://weshare.click'

const globalMocks = {
  'node:crypto': {
    randomUUID: () => FIXED_UUID
  },
  '@aws-lambda-powertools/metrics': {
    Metrics: class Metrics {addMetric () {}},
    logMetrics: mockMiddleware
  },
  '@aws-lambda-powertools/tracer': {
    Tracer: sinon.spy(),
    captureLambdaHandler: mockMiddleware
  },
  '@aws-lambda-powertools/logger': {
    Logger: class Logger {info () {}},
    injectLambdaContext: mockMiddleware
  },
  '@aws-sdk/client-s3': {
    S3Client: sinon.spy(),
    PutObjectCommand: sinon.spy()
  },
  '@aws-sdk/s3-request-presigner': {
    getSignedUrl: async function () {
      return 'https://presignedurl.com'
    }
  }
}

tap.test('content disposition is used if filename is provided', async t => {
  const { handleEvent } = await esmock('../share-handler.js', globalMocks)

  const eventWithFilename = {
    queryStringParameters: { filename: 'test.txt' }
  }

  const response = await handleEvent(eventWithFilename)
  t.ok(response.body.includes('-H \'content-disposition: attachment; filename="test.txt"\''))
})

tap.test('content disposition is NOT used if filename is NOT provided', async t => {
  const { handleEvent } = await esmock('../share-handler.js', globalMocks)

  const eventWithoutFilename = {}

  const response = await handleEvent(eventWithoutFilename)
  t.ok(!response.body.includes('-H \'content-disposition: attachment;'))
})

tap.test('content disposition is properly sanitised', async t => {
  const { handleEvent } = await esmock('../share-handler.js', globalMocks)

  const cases = [
    ['   ', false],
    ['//////', false],
    ['../', false],
    ['?.//-/tes//t.txt', '.-test.txt'],
    ['?.\\-\\tes\\t.txt', '.-test.txt'],
    ['写真.jpg', '写真.jpg'],
    ['📸.jpg', '📸.jpg']
  ]

  for (const [filename, expected] of cases) {
    const eventWithFilename = {
      queryStringParameters: { filename }
    }

    const response = await handleEvent(eventWithFilename)
    if (expected === false) {
      t.ok(!response.body.includes('-H \'content-disposition: attachment;'), `Filename ${filename} should not generate content-disposition`)
    } else {
      t.ok(response.body.includes(` -H 'content-disposition: attachment; filename="${expected}"'`), `Filename ${filename} should generate sanitised filename: ${expected}.\n\nReceived response body: ${response.body}`)
    }
  }
})

tap.test('produces a JSON output if passed accept: application/json', async t => {
  const { handleEvent } = await esmock('../share-handler.js', globalMocks)

  const eventWithFilename = {
    queryStringParameters: { filename: 'test.txt' },
    headers: { accept: 'application/json' }
  }

  const expectedBody = {
    filename: 'test.txt',
    headers: { 'content-disposition': 'attachment; filename="test.txt"' },
    uploadUrl: 'https://presignedurl.com',
    downloadUrl: 'https://weshare.click/share/00000000-0000-0000-0000-000000000000'
  }

  const response = await handleEvent(eventWithFilename)
  const body = JSON.parse(response.body)

  t.same(body, expectedBody)
})
