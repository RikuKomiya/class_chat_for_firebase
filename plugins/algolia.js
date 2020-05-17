import * as algoliaserch from 'algoliasearch'
import config from '~/algolia.config.js'

const client = algoliaserch(config.appId, config.apiKey)

export default client
