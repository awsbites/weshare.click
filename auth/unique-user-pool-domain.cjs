const { createHash } = require('node:crypto')

module.exports = async function ({ options, resolveVariable }) {
  const account = await resolveVariable('aws:accountId')
  const region = await resolveVariable('aws:region')
  const stage = await resolveVariable('sls:stage')
  const input = `weshare-${account}-${region}-${stage}`
  const name = 'weshare-' + createHash('md5').update(input).digest('hex').substring(0, 8)
  return {
    name
  }
}
