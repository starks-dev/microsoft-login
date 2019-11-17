import { UserAgentApplication, AuthError } from 'msal'
import {LOGGED_IN} from "./types";
import axios from 'axios'
import config from './config'

// INFO FROM https://spblog.net/post/2019/06/04/building-single-page-application-with-react-msal-js-and-pnpjs

const CLIENT_ID           =  config.CLIENT_ID
const TENANT              =  config.TENANT
const AUTHORITY           = 'https://login.microsoftonline.com/common'
const REDIRECT_URI        = 'http://localhost:3000'
const API_URL_AUTHORIZE   = 'https://login.microsoftonline.com/' + TENANT + '/oauth2/v2.0/authorize'
const API_GRAPH           = 'https://graph.microsoft.com/v1.0/me'

const MSAL_CONFIG = {
  authority: AUTHORITY,
  clientId: CLIENT_ID
}

const GRAPH_SCOPES = [
  "user.read",
  "calendars.read"
]

const AUTH_PARAMS = {
  scopes: GRAPH_SCOPES
}

class Service  {
  private authProvider: UserAgentApplication;

  constructor() {
    this.authProvider = new UserAgentApplication({
      auth: MSAL_CONFIG
    });

    // action to perform on authentication
    this.authProvider.handleRedirectCallback(() => { // on success
      localStorage.setItem(LOGGED_IN, this.authProvider.getAccount().accountIdentifier);
    })
  }

  getProvider() {
    return this.authProvider;
  }

  logOut() {
    this.authProvider.logout()
    localStorage.removeItem(LOGGED_IN);
  }

  startAsync = async () => {
    await this.authProvider.loginPopup(AUTH_PARAMS)
    if (this.authProvider.getAccount()) {
      localStorage.setItem(LOGGED_IN, this.authProvider.getAccount().accountIdentifier);

      return this.authProvider.getAccount()
    }

    return false
  };

  getUserData = async (params: string = "") => {
    try {
      const {accessToken} = await this.authProvider.acquireTokenSilent(AUTH_PARAMS)

      const headers = {
        'Authorization': `Bearer ${accessToken}`
      }

      let user = await axios.get(
          API_GRAPH + params,
          {headers}
      )

      if (user.data) {

        console.log(user.data)
        return user.data
      }
    } catch(error) {
      console.log(error.message)
    }

    return null
  }
}

export default Service