import { useConfigStore } from '@/stores/config'

let tokenClient
let gapiInited = false
let gisInited = false

export function gapiLoaded() {
  gapi.load('client', initializeGapiClient)
}

async function initializeGapiClient() {
  const configStore = useConfigStore()
  await gapi.client.init({
    apiKey: configStore.getGoogleApiKey,
    discoveryDocs: [configStore.getGoogleDiscoveryDoc]
  })
  gapiInited = true
}

export function gisLoaded() {
  const configStore = useConfigStore()
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: configStore.getGoogleClientId,
    scope: configStore.getGoogleScopes
  })
  gisInited = true
}

export function isUserInteractionEnable() {
  return gapiInited && gisInited
}

export function handleAuthClick(callback) {
  // if (!isUserInteractionEnable()) return false
  if (gapi.auth2.getAuthInstance() && gapi.auth2.getAuthInstance().isSignedIn.get()) return true
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp
    } else {
      console.log('callback')
      if (typeof callback === 'function') {
        console.log('callback')

        callback()
      }
    }
  }
  console.log('request token')
  if (gapi.client.getToken() === null) {
    tokenClient.requestAccessToken({ prompt: 'consent' })
  } else {
    tokenClient.requestAccessToken({ prompt: '' })
  }
  console.log('popup')
  return true
}

export function handleSignoutClick() {
  const token = gapi.client.getToken()
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token)
    gapi.client.setToken('')
  }
}
