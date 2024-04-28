export default class GoogleGapiHandler {
  tokenClient = undefined
  API_KEY = 'AIzaSyBPShQcWXAEbDr_4MmlDGvO5ISCIFL-cLM'
  CLIENT_ID = '925112903740-3ecuv4hd59pnshb94ce6vavs5q6tb9pf.apps.googleusercontent.com'
  DISCOVERY_DOC = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
  SCOPES = 'https://www.googleapis.com/auth/calendar'

  constructor() {
    this.gapiLoaded()
    this.gisLoaded()
  }
  gapiLoaded() {
    gapi.load('client', this.initializeGapiClient.bind(this))
  }

  gisLoaded() {
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: this.CLIENT_ID,
      scope: this.SCOPES,
      callback: 'http://localhost:5173' // defined later
    })
  }

  async initializeGapiClient() {
    var init = {
      apiKey: this.API_KEY,
      discoveryDocs: [this.DISCOVERY_DOC]
    }
    await gapi.client.init(init)
  }
}
