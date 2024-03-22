export const getApiBaseUrl = (baseurl) => {
  const url = new URL(baseurl)
  url.hostname = 'api.' + url.hostname
  return url.toString()
}
