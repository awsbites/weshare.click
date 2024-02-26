export const TOKEN_REQUEST_INTERVAL_SECONDS = 2
export const CODE_EXPIRY_SECONDS = 5 * 60
export const { AWS_REGION, API_BASE_URL, TABLE_NAME, USER_POOL_DOMAIN, CLIENT_ID } = process.env
export const VERIFICATION_URI = `${API_BASE_URL}/auth/verify`
export const REDIRECT_URI = `${API_BASE_URL}/auth/callback`
export const COGNITO_OAUTH_BASE_URI = `https://${USER_POOL_DOMAIN}/oauth2`
export const COGNITO_OAUTH_CODE_URI = `${COGNITO_OAUTH_BASE_URI}/authorize`
export const COGNITO_OAUTH_TOKEN_URI = `${COGNITO_OAUTH_BASE_URI}/token`
