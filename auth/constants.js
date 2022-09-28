export const DeviceAuthStatus = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  CODE_ISSUED: 'code_issued',
  ERROR: 'error'
}

export const OAuthErrorCodes = {
  // Device Access Token Response error codes (https://www.rfc-editor.org/rfc/rfc8628#section-3.5)
  AUTHORIZATION_PENDING: 'authorization_pending',
  EXPIRED_TOKEN: 'expired_token',
  ACCESS_DENIED: 'access_denied',
  SLOW_DOWN: 'slow_down',
  // OAuth 2.0 Response error codes (https://www.rfc-editor.org/rfc/rfc6749#section-5.2)
  INVALID_REQUEST: 'invalid_request',
  INVALID_CLIENT: 'invalid_client',
  INVALID_GRANT: 'invalid_grant',
  UNAUTHORIZED_CLIENT: 'unauthorized_client',
  UNSUPPORTED_GRANT_TYPE: 'unsupported_grant_type',
  INVALID_SCOPE: 'invalid_scope'
}