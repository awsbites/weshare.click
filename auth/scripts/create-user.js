import {
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminInitiateAuthCommand,
  AdminRespondToAuthChallengeCommand,
  AdminResetUserPasswordCommand,
  CognitoIdentityProviderClient
} from '@aws-sdk/client-cognito-identity-provider'

import meow from 'meow'
import jwt from 'jsonwebtoken'
import { Chance } from 'chance'

const cli = meow(`
  Usage
  $ weshare create-user <EMAIL> --user-pool-id <user-pool-id>
`, {
  importMeta: import.meta,
  flags: {
    userPoolId: {
      type: 'string',
      shortFlag: 'u',
      isRequired: true
    },
    clientId: {
      type: 'string',
      shortFlag: 'c',
      isRequired: true
    }
  }
})

const { clientId, userPoolId } = cli.flags
const email = cli.input[0]

const generatePassword = () => Chance().string({ length: 16, symbols: true })

const cognitoServiceProvider = new CognitoIdentityProviderClient({})

createUser(email)

export async function createUser (email) {
  const password = generatePassword()

  const createRequest = {
    UserPoolId: userPoolId,
    Username: email,
    MessageAction: 'SUPPRESS',
    TemporaryPassword: password,
    UserAttributes: [{ Name: 'email', Value: email }, { Name: 'email_verified', Value: 'true' }]
  }

  await cognitoServiceProvider.send(new AdminCreateUserCommand(createRequest))

  const authRequest = {
    AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
    UserPoolId: userPoolId,
    ClientId: clientId,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password
    }
  }

  const authResponse = await cognitoServiceProvider.send(
    new AdminInitiateAuthCommand(authRequest)
  )

  const challengeRequest = {
    UserPoolId: userPoolId,
    ClientId: clientId,
    ChallengeName: authResponse.ChallengeName,
    Session: authResponse.Session,
    ChallengeResponses: {
      USERNAME: email,
      NEW_PASSWORD: generatePassword()
    }
  }

  const challengeResponse = await cognitoServiceProvider.send(
    new AdminRespondToAuthChallengeCommand(challengeRequest)
  )

  const { 'cognito:username': userId } = jwt.decode(
    challengeResponse.AuthenticationResult.IdToken
  )

  console.log({ userId })
  const resetPasswordResponse = await cognitoServiceProvider.send(
    new AdminResetUserPasswordCommand({
      Username: email,
      UserPoolId: userPoolId,
      ClientMetadata: {
        InitationFlow: 'true'
      }
    })
  )

  console.log(resetPasswordResponse)

  // const user = {
  //   userId,
  //   email,
  //   username: email,
  //   accessToken: challengeResponse.AuthenticationResult.AccessToken,
  //   idToken: challengeResponse.AuthenticationResult.IdToken,
  // };
  // return user;
}

export async function deleteUser (user) {
  const backendConfig = await loadBackendConfig()
  const deleteRequest = {
    UserPoolId: backendConfig.userPoolId,
    Username: user.email
  }
  await cognitoServiceProvider.send(new AdminDeleteUserCommand(deleteRequest))
}
