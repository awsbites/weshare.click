import { basename } from 'node:path'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { request } from 'undici'
import { config } from '../config.js'

export default async function upload (filepath) {
  const baseurl = config.get('baseurl')
  const accessToken = config.get('access_token')
  if (!baseurl || !accessToken) {
    console.log('It looks like you need to login. Please run:\n\n> weshare login')
    process.exit(1)
  }

  const SHARE_URL = `${baseurl}/share/`

  try {
    // read the filepath and check that exists and its a file
    const stats = await stat(filepath)
    if (!stats.isFile()) {
      throw new Error(`${filepath} is not a file`)
    }
    const filename = basename(filepath)
    const shareUrl = new URL(SHARE_URL)
    shareUrl.searchParams.append('filename', filename)

    // call the weshare POST endpoint to get an upload url with the filepath name
    const shareUrlResp = await request(shareUrl, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'user-agent': 'weshare.click cli',
        authorization: `Bearer ${accessToken}`
      }
    })
    if (shareUrlResp.statusCode !== 201) {
      const responseText = await shareUrlResp.body.text()
      throw new Error(`Unexpected status code received from server: ${shareUrlResp.statusCode}\n\n${responseText}`)
    }

    const shareUrlRespBody = await shareUrlResp.body.json()

    const fileStream = createReadStream(filepath)

    // upload the file using the presigned uploadUrl
    const uploadResp = await request(shareUrlRespBody.uploadUrl, {
      method: 'PUT',
      headers: {
        'content-type': 'application/octet-stream',
        'content-length': stats.size,
        ...shareUrlRespBody.headers
      },
      body: fileStream
    })

    if (uploadResp.statusCode !== 200) {
      const responseText = await uploadResp.body.text()
      throw new Error(`Unexpected status code received from S3: ${uploadResp.statusCode}\n\n${responseText}`)
    }

    // print the download url
    console.log(shareUrlRespBody.downloadUrl)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}
