const { BASE_URL } = process.env

/**
 * Creates a redirect to the UI to display success or error text
 *
 * @param {*} successText
 * @param {*} errorText
 */
export function uiResponse (successText, errorText) {
  const params = new URLSearchParams()
  if (successText) {
    params.set('success', successText)
  }
  if (errorText) {
    params.set('error', errorText)
  }
  return {
    statusCode: 302,
    headers: {
      Location: `${BASE_URL}/verification-result?${params}`
    }
  }
}

export function jsonResponse (statusCode, object) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(object)
  }
}
