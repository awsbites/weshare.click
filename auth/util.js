export function htmlResponse (statusCode, text) {
  return {
    statusCode,
    body: `<html>${text}</html>`,
    header: {
      'content-type': 'text/html'
    }
  }
}