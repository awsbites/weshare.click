import { Metrics, logMetrics, MetricUnits } from '@aws-lambda-powertools/metrics'
import { Tracer, captureLambdaHandler } from '@aws-lambda-powertools/tracer'
import { Logger, injectLambdaContext } from '@aws-lambda-powertools/logger'

import middy from '@middy/core'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import httpUrlEncodeBodyParser from '@middy/http-urlencode-body-parser'
import { request } from 'undici'

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

import { COGNITO_OAUTH_TOKEN_URI, CLIENT_ID, TABLE_NAME, REDIRECT_URI } from './config.js'
import { DeviceAuthStatus, OAuthErrorCodes } from './constants.js'
import { jsonResponse } from './util.js'

const tracer = new Tracer()
const logger = new Logger()
const metrics = new Metrics()

const ddbClient = new DynamoDBClient()
const docClient = DynamoDBDocument.from(ddbClient)

/**
 * Handles an RFC8628 Device Access Token Request
 * https://www.rfc-editor.org/rfc/rfc8628#page-10
 *
 * @param {*} event Lambda HTTP API Event
 */
async function handler (event, context) {
  const { grant_type: grantType, device_code: deviceCode } = event.body
  metrics.addMetric('TokenRequestCount', MetricUnits.Count, 1)

  if (grantType !== 'urn:ietf:params:oauth:grant-type:device_code') {
    return jsonResponse(400, {
      error: 'Invalid grant type'
    })
  }

  const deviceCodeKey = `device_code#${deviceCode}`
  const getItemInput = {
    TableName: TABLE_NAME,
    Key: {
      pk: deviceCodeKey,
      sk: deviceCodeKey
    }
  }

  logger.info({ getItemInput }, 'Reading device code')
  const ddbResponse = await docClient.get(getItemInput)
  logger.debug({ ddbResponse }, 'DynamoDB response for getItem')

  if (!ddbResponse.Item) {
    metrics.addMetric('MissingItemCount', MetricUnits.Count, 1)
    // Assume it is expired if missing
    return jsonResponse(400, {
      error_code: OAuthErrorCodes.EXPIRED_TOKEN
    })
  }

  const { s: status, code, error, errorDesc } = ddbResponse.Item
  switch (status) {
    case DeviceAuthStatus.CODE_ISSUED:
      return await fetchToken(code)
    case DeviceAuthStatus.PENDING:
    case DeviceAuthStatus.VERIFIED:
      return jsonResponse(400, { error_code: OAuthErrorCodes.AUTHORIZATION_PENDING })
    case DeviceAuthStatus.ERROR:
      return jsonResponse(400, { error_code: error, error_description: errorDesc })
    default:
      return jsonResponse(400, {
        error_code: OAuthErrorCodes.INVALID_GRANT,
        error_description: `Invalid status: ${status}`
      })
  }
}

/**
 * Initiate an OAuth 2.0 Access Token Request
 *
 * https://www.rfc-editor.org/rfc/rfc6749#page-29
 * 
 * @param {*} oauthCode The code retrieved already from the authorization server
 * @returns HTTP Lambda proxy response for the request
 */
async function fetchToken (oauthCode) {
  metrics.addMetric('TokenFetchCount', MetricUnits.Count, 1)
  const url = new URL(COGNITO_OAUTH_TOKEN_URI)

  const tokenGrantParams = new URLSearchParams()
  tokenGrantParams.append('grant_type', 'authorization_code')
  tokenGrantParams.append('client_id', CLIENT_ID)
  tokenGrantParams.append('redirect_uri', REDIRECT_URI)
  tokenGrantParams.append('code', oauthCode)

  const options = {
    method: 'POST',
    body: tokenGrantParams.toString(),
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  }

  logger.info({ url, options }, 'Requesting access token with URL')
  const tokenResp = await request(url, options)

  const { statusCode, statusText } = tokenResp
  const responseText = await tokenResp.body.text()
  const response = {
    statusCode,
    statusText,
    body: responseText,
    headers: {
      'cache-control': 'no-store'
    }
  }
  logger.info({ response }, 'Returning token response')
  return response
}

export const handleEvent = middy(handler)
  .use(injectLambdaContext(logger, { logEvent: true }))
  .use(logMetrics(metrics))
  .use(captureLambdaHandler(tracer))
  .use(httpHeaderNormalizer())
  .use(httpUrlEncodeBodyParser())
