import {setTimeout} from 'node:timers/promises'
import querystring from 'node:querystring'
import enquirer from 'enquirer'
import { request } from 'undici'
import open from 'open'
import ora from 'ora'
import { config } from '../config.js'
import { getApiBaseUrl } from '../utils.js'

export default async function login () {
  // prompt for domain
  const { baseurl } = await enquirer.prompt({
    type: 'input',
    name: 'baseurl',
    message: 'Please enter the base url of your weshare.click deployment',
    validate: (input) => {
      try {
        // eslint-disable-next-line no-new
        new URL(input)
        return true
      } catch {
        return 'Please enter a valid URL'
      }
    },
    initial: config.get('baseurl') || 'https://weshare.click'
  })
  const apiBaseUrl = getApiBaseUrl(baseurl)
  const DEVICE_AUTH_URL = `${apiBaseUrl}auth/device_authorization`
  console.log(DEVICE_AUTH_URL)
  const deviceAuthResp = await request(DEVICE_AUTH_URL, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'user-agent': 'weshare.click cli'
    }
  })
  const deviceAuthRespBody = await deviceAuthResp.body.json()
  console.log(deviceAuthRespBody)

  // start device flow and get redirect url and codes
  console.log(`Please log in at ${deviceAuthRespBody.verification_uri_complete}`)
  try {
    // open the browser
    await open(deviceAuthRespBody.verification_uri_complete)
  } catch {}

  const spinner = ora('Waiting to complete the login in the browser...').start()

  // poll in the background
  let loggedIn = null

  const TOKEN_URL = `${apiBaseUrl}auth/token`
  const tokenPayload = querystring.encode({
    grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
    device_code: deviceAuthRespBody.device_code
  })
  const tokenHeaders = {
    accept: 'application/json',
    'content-type': 'application/x-www-form-urlencoded',
    'user-agent': 'weshare.click cli'
  }

  while (!loggedIn) {
    await setTimeout(deviceAuthRespBody.interval * 1000)

    const tokenResp = await request(TOKEN_URL, {
      method: 'POST',
      headers: tokenHeaders,
      body: tokenPayload
    })
    const tokenRespBody = await tokenResp.body.json()

    if (tokenResp.statusCode === 200) {
      loggedIn = tokenRespBody
      spinner.succeed('Login successful')
    } else if (tokenRespBody.error_code !== 'authorization_pending') {
      spinner.fail(`Login failed: ${tokenRespBody.error_code}`)
      process.exit(1)
    }
  }

  // when we get tokens, persist them in a file
  config.set('baseurl', baseurl)
  config.set('id_token', loggedIn.id_token)
  config.set('access_token', loggedIn.access_token)
  config.set('refresh_token', loggedIn.refresh_token)

  // login complete
}