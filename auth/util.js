export function htmlResponse (statusCode, text) {
  return {
    statusCode,
    body: `<html>${text}</html>`,
    headers: {
      'content-type': 'text/html'
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
