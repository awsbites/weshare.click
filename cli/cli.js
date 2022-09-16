#!/usr/bin/env node

import { basename } from 'node:path'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { request } from 'undici'
import { program } from 'commander'

const BASE_URL = 'https://weshare.click/share/'

program
  .name('weshare')
  .description('The weshare.click cli tool for uploading files')
  .addHelpText('after', `
  
  To upload a file from the local directory:

  $ weshare <FILENAME>
`)
  .argument('<filepath>', 'Path to the file to upload')
  .action(async function (filepath) {
    try {
      // read the filepath and check that exists and its a file
      const stats = await stat(filepath)
      if (!stats.isFile()) {
        throw new Error(`${filepath} is not a file`)
      }
      const filename = basename(filepath)
      const shareUrl = new URL(BASE_URL)
      shareUrl.searchParams.append('filename', filename)

      // call the weshare POST endpoint to get an upload url with the filepath name
      const shareUrlResp = await request(shareUrl, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'user-agent': 'weshare.click cli'
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
  })
  .parse()
