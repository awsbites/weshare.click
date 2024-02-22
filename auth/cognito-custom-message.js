export async function handler(event) {
  // event.triggerSource can be:
  //   CustomMessage_SignUp
  //   CustomMessage_AdminCreateUser
  //   CustomMessage_ResendCode
  //   CustomMessage_ForgotPassword
  //   CustomMessage_UpdateUserAttribute
  //   CustomMessage_VerifyUserAttribute
  //   CustomMessage_Authentication
  // See https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-custom-message.html
  const eventString = JSON.stringify(event, undefined, 2);
  console.log(eventString);
  const result = {
    ...event,
    response: {
      emailSubject: 'Custom Message',
      emailMessage: eventString,
    },
  };
  return result;
}