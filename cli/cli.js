#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { program, InvalidOptionArgumentError } from 'commander'
import upload from './commands/upload.js'
import login from './commands/login.js'
import logout from './commands/logout.js'
import { isUrl } from './utils.js'

const pkg = JSON.parse(readFileSync(join('.', 'package.json'), 'utf8'))

program
  .name('weshare')
  .version(pkg.version)
  .description('The weshare.click cli tool for uploading files')
  .addHelpText('after', `

  To upload a file from the local directory:

  $ weshare <FILENAME>
  `)

program
  .command('login')
  .option('-b, --baseurl <baseurl>', 'The base url of your weshare.click deployment', function (baseurl) {
    if (!isUrl(baseurl)) {
      throw new InvalidOptionArgumentError('Please provide a valid URL.')
    }
    return baseurl
  })
  .option('--no-open', 'Do not try to automatically open the browser')
  .description('Logins to a weshare.click instance')
  .action(login)

program
  .command('logout')
  .description('Deletes credentials from the local machine')
  .action(logout)

program
  .command('upload', { isDefault: true })
  .description('Uploads a file to a weshare.click instance')
  .argument('<filepath>', 'Path to the file to upload')
  .action(upload)

program
  .parse()
