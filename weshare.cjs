// @ts-check
'use strict'

/**
 * @typedef {'af-south-1' | 'eu-north-1' | 'ap-south-1' | 'eu-west-3' | 'eu-west-2' | 'eu-south-1' | 'eu-west-1' | 'ap-northeast-3' | 'ap-northeast-2' | 'me-south-1' | 'ap-northeast-1' | 'me-central-1' | 'sa-east-1' | 'ca-central-1' | 'ap-east-1' | 'ap-southeast-1' | 'ap-southeast-2' | 'ap-southeast-3' | 'eu-central-1' | 'us-east-1' | 'us-east-2' | 'us-west-1' | 'us-west-2'} Region
 */

/**
 * @typedef {Object} Config
 * @property {Region=} region - The AWS region to use for the deployment
 * @property {string=} stage - The AWS region to use for the deployment
 * @property {string} domain - The domain name to use for the deployment (e.g. files.weshare.click)
 * @property {string=} serviceName - The name of the service (for resource naming), default: 'weshare'
 */

/**
 * @type {Region}
 */
const defaultRegion = /** @type {Region} */ (process.env.AWS_REGION) || /** @type {Region} */ (process.env.DEFAULT_AWS_REGION) || 'eu-west-1'

const defaultConfig = {
  region: defaultRegion,
  stage: 'dev',
  serviceName: 'weshare'
}

/**
 * Defines the configuration for the weshare deployment
 * @param {Config} config
 * @returns {Config}
 */
exports.defineConfig = function (config) {
  return { ...defaultConfig, ...config }
}
