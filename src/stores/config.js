import { defineStore } from 'pinia'
import axios from 'axios'
import { getHeaderConfig } from '../utils/ApiHandler.js'

export const useConfigStore = defineStore('config', {
  state: () => ({
    baseApiUrl: 'https://localhost:7030',
    baseChatApiUrl: 'https://localhost:7029',
    googleApiKey: '',
    googleClientId: '',
    googleDiscoveryDoc: '',
    googleScopes: '',
    jwtTokenName: '',
    imgurClientId: '',
    imgurClientSecret: ''
  }),
  getters: {
    getBaseApiUrl: (state) => state.baseApiUrl,
    getBaseChatApiUrl: (state) => state.baseChatApiUrl,
    getGoogleApiKey: (state) => state.googleApiKey,
    getGoogleClientId: (state) => state.googleClientId,
    getGoogleDiscoveryDoc: (state) => state.googleDiscoveryDoc,
    getGoogleScopes: (state) => state.googleScopes,
    getJwtTokenName: (state) => state.jwtTokenName,
    getImgurClientId: (state) => state.imgurClientId,
    getImgurClientSecret: (state) => state.imgurClientSecret
  },
  actions: {
    setBaseApiUrl(url) {
      this.baseApiUrl = url
    },
    setBaseChatApiUrl(url) {
      this.baseChatApiUrl = url
    },
    setGoogleApiKey(key) {
      this.googleApiKey = key
    },
    setGoogleClientId(id) {
      this.googleClientId = id
    },
    setGoogleDiscoveryDoc(doc) {
      this.googleDiscoveryDoc = doc
    },
    setGoogleScopes(scopes) {
      this.googleScopes = scopes
    },
    setJwtTokenName(name) {
      this.jwtTokenName = name
    },
    setImgurClientId(id) {
      this.imgurClientId = id
    },
    setImgurClientSecret(secret) {
      this.imgurClientSecret = secret
    },
    async fetchConfig() {
      const response = await axios.get(import.meta.env.VITE_API + '/config', getHeaderConfig())
      const config = response.data
      this.setBaseApiUrl(config.baseApiUrl)
      this.setBaseChatApiUrl(config.baseChatApiUrl)
      this.setGoogleApiKey(config.googleApiKey)
      this.setGoogleClientId(config.googleClientId)
      this.setGoogleDiscoveryDoc(config.googleDiscoveryDoc)
      this.setGoogleScopes(config.googleScopes)
      this.setJwtTokenName(config.jwtTokenName)
      this.setImgurClientId(config.imgurClientId)
      this.setImgurClientSecret(config.imgurClientSecret)
    }
  }
})
