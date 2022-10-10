import Conf from 'conf'

const schema = {
  baseurl: {
    type: 'string',
    format: 'url'
  },
  id_token: {
    type: 'string'
  },
  access_token: {
    type: 'string'
  },
  refresh_token: {
    type: 'string'
  }
}

export const config = new Conf({
  schema,
  projectName: 'weshare'
})
