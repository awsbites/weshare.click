import { config } from '../config.js'

export default async function logout() {
  config.clear()
  console.log('You have been logged out')
}