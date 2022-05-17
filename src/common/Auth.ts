import config from './Config'

import axios, { AxiosResponse } from 'axios'
import * as jose from 'jose'

import { User } from '../common/Types'

export class Auth {
  // todo: remove sensitive data from local storage. maybe store in db the api token with sensitive data
  private static instance: Auth
  private _user: User | null

  private constructor() {
    this._user = this.user
  }

  public static getInstance(): Auth {
    if (!Auth.instance) {
      Auth.instance = new Auth()
    }
    return Auth.instance
  }

  get user(): User | null {
    if (!this._user) {
      const storedUser = window.localStorage.getItem(
        config.LOCAL_STORAGE_USER_NAME
      )
      if (storedUser) this._user = JSON.parse(storedUser)
    }
    return this._user
  }

  get token(): string | null {
    return window.localStorage.getItem(config.LOCAL_STORAGE_API_TOKEN_NAME)
  }

  checkLogin(): boolean {
    const api_token = window.localStorage.getItem(
      config.LOCAL_STORAGE_API_TOKEN_NAME
    )

    if (!api_token) return false

    const payload = jose.decodeJwt(api_token)
    const now = new Date()
    const expire = new Date(0)
    if (payload.exp) {
      expire.setUTCSeconds(payload.exp)

      if (now.getTime() > expire.getTime()) {
        console.log('API Token has expired')
        return false
      }
      return true
    }
    return false
  }

  isAdmin(): boolean {
    return (this.user && this.user.role_id * 1 === 1) || false
  }

  login(
    email: string,
    password: string,
    callback: (loggedin: boolean, data: any) => any
  ): void {
    email = email.toLowerCase()
    axios
      .post(`${config.API_URL}user/login`, {
        email,
        password,
      })
      .then((response: AxiosResponse) => {
        window.localStorage.setItem(
          config.LOCAL_STORAGE_API_TOKEN_NAME,
          response.data.access_token
        )

        window.localStorage.setItem(
          config.LOCAL_STORAGE_USER_NAME,
          JSON.stringify(response.data.user)
        )
        callback(true, '')
      })
      .catch((error) => {
        if (error.response) {
          callback(false, error.response)
        } else if (error.request) {
          callback(false, error.request)
        } else {
          callback(false, error.message)
        }
      })
  }

  logout(callback: () => void): void {
    this._user = null
    window.localStorage.removeItem(config.LOCAL_STORAGE_API_TOKEN_NAME)
    window.localStorage.removeItem(config.LOCAL_STORAGE_USER_NAME)
    callback()
  }
}

export default Auth.getInstance()
