import Mailgun from 'mailgun.js'
import formData from 'form-data'
import middy from '@middy/core'
import middySsm from '@middy/ssm'
import encryptionSdk from '@aws-crypto/client-node'

const { STAGE, KEY_ALIAS, KEY_ARN } = process.env
const EMAIL_DOMAIN = 'sandbox4e5d8a28162548389a95edc71719a3a4.mailgun.org'

const { decrypt } = encryptionSdk.buildClient(encryptionSdk.CommitmentPolicy.FORBID_ENCRYPT_ALLOW_DECRYPT)
const keyring = new encryptionSdk.KmsKeyringNode({ generatorKeyId: KEY_ARN, keyIds: [KEY_ALIAS] })

const globals = {}

/**
 * Using Mailgun, send an invitation email when the event indicates an Invitation is being created 
 * using a Cognito password reset flow
 * 
 * @param {*} event 
 */
export async function cognitoCustomEmailSenderHandler (event) {
  console.log(event)
  const { request } = event
  if (event.triggerSource === 'CustomEmailSender_ForgotPassword' && request?.clientMetadata?.InitationFlow === 'true') {
    const { email, 'cognito:user_status': userStatus, email_verified: emailVerified } = request.userAttributes
    if (emailVerified === 'true' && userStatus === 'CONFIRMED') {
      const encryptedCode = Buffer.from(request.code, 'base64')
      const { plaintext: plaintextCode } = await decrypt(keyring, encryptedCode)
      await sendInvitationEmail(email, plaintextCode)
    }
  }
}

async function sendInvitationEmail (email, code) {
  const message = `
<h1>You are invited 🤩</h1>

Your code is ${code}
`
  const data = {
    from: `Mailgun Sandbox <postmaster@${EMAIL_DOMAIN}>`,
    to: [email],
    subject: 'Hello',
    html: message
  }
  const response = await globals.mailgun.messages.create(EMAIL_DOMAIN, data)
  console.log(response)
}

export const handler = middy()
  .use(
    middySsm({
      fetchData: {
        mailgunApiKey: `/weshare/${STAGE}/mailgunApiKey`
      },
      setToContext: true
    })
  )
  .before((request) => {
    const { mailgunApiKey } = request.context
    const mailgun = new Mailgun(formData).client({ username: 'api', key: mailgunApiKey })
    globals.mailgun = mailgun
  })
  .handler(cognitoCustomEmailSenderHandler)
