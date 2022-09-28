#!/usr/bin/env node

import { program } from 'commander'
import upload from './commands/upload.js'
import login from './commands/login.js'
import logout from './commands/logout.js'

program
  .name('weshare')
  .description('The weshare.click cli tool for uploading files')
  .addHelpText('after', `

  To upload a file from the local directory:

  $ weshare <FILENAME>
  `)

program
  .command('login')
  .action(login)

program
  .command('logout')
  .action(logout)

program
  .command('upload', {isDefault: true})
  .argument('<filepath>', 'Path to the file to upload')
  .action(upload)

program
  .parse()
