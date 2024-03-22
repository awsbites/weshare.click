#!/usr/bin/env node
import { program } from 'commander'
import {
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminInitiateAuthCommand,
  AdminRespondToAuthChallengeCommand,
  AdminResetUserPasswordCommand,
  CognitoIdentityProviderClient
} from '@aws-sdk/client-cognito-identity-provider'

import jwt from 'jsonwebtoken'
import { Chance } from 'chance'

const cognitoServiceProvider = new CognitoIdentityProviderClient({})
const generatePassword = () => Chance().string({ length: 16, symbols: true })

program
  .name('create-user')
  .description('Creates or removes users in the Cognito User Pool')

program
  .command('create <email>')
  .description('Create a new user')
  .requiredOption('-u, --user-pool-id <userPoolId>')
  .requiredOption('-c, --client-id <clientId>')
  .action(createUser)

program
  .command('remove <email>')
  .description('Remove an existing user')
  .requiredOption('-u, --user-pool-id <userPoolId>')
  .action(deleteUser)

program.parse()

export async function createUser (email, { userPoolId, clientId }) {
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

  await cognitoServiceProvider.send(
    new AdminResetUserPasswordCommand({
      Username: email,
      UserPoolId: userPoolId,
      ClientMetadata: {
        InitationFlow: 'true'
      }
    })
  )

  console.log({ email, userId })

  // const user = {
  //   userId,
  //   email,
  //   username: email,
  //   accessToken: challengeResponse.AuthenticationResult.AccessToken,
  //   idToken: challengeResponse.AuthenticationResult.IdToken,
  // };
  // return user;
}

export async function deleteUser (email, { userPoolId }) {
  const deleteRequest = {
    UserPoolId: userPoolId,
    Username: email
  }
  await cognitoServiceProvider.send(new AdminDeleteUserCommand(deleteRequest))
}
