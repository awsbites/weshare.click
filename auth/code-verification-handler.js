import { Metrics, logMetrics, MetricUnits } from '@aws-lambda-powertools/metrics'
import { Tracer, captureLambdaHandler } from '@aws-lambda-powertools/tracer'
import { Logger, injectLambdaContext } from '@aws-lambda-powertools/logger'
import middy from '@middy/core'

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import cryptoRandomString from 'crypto-random-string'
import { COGNITO_OAUTH_CODE_URI, CODE_EXPIRY_SECONDS, CLIENT_ID, REDIRECT_URI, TABLE_NAME } from './config.js'
import { htmlResponse } from './util.js'
import { DeviceAuthStatus } from './constants.js'

const tracer = new Tracer()
const logger = new Logger()
const metrics = new Metrics()

const ddbClient = new DynamoDBClient()
const docClient = DynamoDBDocument.from(ddbClient)

async function handler (event, context) {
  const { user_code: userCode } = event.queryStringParameters
  const userCodeKey = `user_code#${userCode}`

  const expiryTime = (Date.now() / 1000) + CODE_EXPIRY_SECONDS

  metrics.addMetric('VerificationAttemptCount', MetricUnits.Count, 1)

  const queryInput = {
    TableName: TABLE_NAME,
    IndexName: 'gsi1',
    KeyConditionExpression: 'gsi1pk = :userCodeKey and gsi1sk = :userCodeKey',
    ExpressionAttributeValues: {
      ':userCodeKey': userCodeKey
    }
  }

  logger.debug({ queryInput })
  const ddbQueryResponse = await docClient.query(queryInput)
  logger.debug({ ddbQueryResponse })

  if (ddbQueryResponse.Items?.length === 0) {
    return htmlResponse(400, 'Invalid code. Maybe it expired?')
  }

  const { pk, sk } = ddbQueryResponse.Items[0]
  const state = cryptoRandomString({ length: 32, type: 'url-safe' })
  const stateKey = `state#${state}`
  const updateItemInput = {
    TableName: TABLE_NAME,
    Key: { pk, sk },
    UpdateExpression: 'SET gsi2pk = :stateKey, gsi2sk = :stateKey, #status = :newStatus',
    ExpressionAttributeNames: {
      '#status': 's',
      '#exp': 'expiration'
    },
    ExpressionAttributeValues: {
      ':newStatus': DeviceAuthStatus.VERIFIED,
      ':stateKey': stateKey,
      ':prevStatus': DeviceAuthStatus.PENDING,
      ':expiryTime': expiryTime
    },
    ConditionExpression: '#status = :prevStatus AND #exp <= :expiryTime'
  }

  try {
    await docClient.update(updateItemInput)
  } catch (err) {
    if (err.name === 'ConditionalCheckFailedException') {
      return htmlResponse(400, 'The token is expired or already verified')
    }
    logger.error({ err })
    return htmlResponse(500, `Oops. Something went wrong with request ID: ${context.awsRequestId}`)
  }

  const destinationUrl = new URL(COGNITO_OAUTH_CODE_URI)
  destinationUrl.searchParams.append('response_type', 'code')
  destinationUrl.searchParams.append('client_id', CLIENT_ID)
  destinationUrl.searchParams.append('redirect_uri', REDIRECT_URI)
  destinationUrl.searchParams.append('state', state)
  destinationUrl.searchParams.append('scope', 'openid')

  return {
    statusCode: 302,
    header: {
      location: destinationUrl.toString()
    }
  }
}

export const handleEvent = middy(handler)
  .use(injectLambdaContext(logger, { logEvent: true }))
  .use(logMetrics(metrics))
  .use(captureLambdaHandler(tracer))
