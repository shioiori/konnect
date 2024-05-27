let tokenClient
let gapiInited = false
let gisInited = false
const API_KEY = 'AIzaSyBPShQcWXAEbDr_4MmlDGvO5ISCIFL-cLM'
const CLIENT_ID = '925112903740-3ecuv4hd59pnshb94ce6vavs5q6tb9pf.apps.googleusercontent.com'
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
const SCOPES = 'https://www.googleapis.com/auth/calendar'

export function gapiLoaded() {
  gapi.load('client', initializeGapiClient)
}

async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC]
  })
  gapiInited = true
}

export function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: 'http://localhost:5173/timetable' // defined later
  })
  gisInited = true
}

export function isUserInteractionEnable() {
  return gapiInited && gisInited
}

export function handleAuthClick(callback) {
  if (!isUserInteractionEnable()) return false
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
