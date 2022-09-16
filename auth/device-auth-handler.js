import { Metrics, logMetrics, MetricUnits } from '@aws-lambda-powertools/metrics'
import { Tracer, captureLambdaHandler } from '@aws-lambda-powertools/tracer'
import { Logger, injectLambdaContext } from '@aws-lambda-powertools/logger'
import middy from '@middy/core'

import cryptoRandomString from 'crypto-random-string'

const tracer = new Tracer()
const logger = new Logger()
const metrics = new Metrics()

async function handler (event) {
  // Create a device code (high entropy)
  const deviceCode = cryptoRandomString({ length: 48, type: 'url-safe' })

  // Create a user code (readable, typeable, lower entropy)
  const userCode = cryptoRandomString({ length: 8, type: 'distinguishable' })

  // Create an entry in the table

  // Create some metrics

  // Construct the RFC8628 device authorization response
  /**
   * {
   *   device_code:,
   *   user_code:,
   *   verification_uri:,
   *   verification_uri_complete:,
   *   expires_in:,
   *   internval:
   * }
   */
  // Return the response

}

export const handleEvent = middy(handler)
  .use(injectLambdaContext(logger, { logEvent: true }))
  .use(logMetrics(metrics))
  .use(captureLambdaHandler(tracer))