/**
 *
 * 用于请求的lib
 * chengkebin 2019-12-24
 *
 * useage:
 * const arthas: Arthas = new Arthas({
 *  baseUrl: 'https://api.shuidimiaoyi.com',
    catchCode (err: CommonResponse<Error>) {
      const action = platform.catchError(err.code)
      action && action(err.code)
    }
 * })
 *
 */

import qs from 'qs'
import _ from './utils'

interface OptionsType {
  headers?: object
  baseUrl: string
  catchCode?(err: CommonResponse<Error>): void
  bodyMixinForUser?(body: object): object
  urlMixin?(url: string): string
}

export interface CommonResponse<T> extends Response {
  code: number;
  msg?: string|null;
  data: T;
}

interface MethodOptionType {
  headers?: object
}

const defaultHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'Accept': 'application/json, text/plain, */*'
}

export default class Arthas {
  commonHeaders?: object
  baseUrl: string
  catchCode?(err: CommonResponse<Error>): void
  bodyMixinForUser?(body: object): object
  urlMixin?(url: string): string

  constructor (options: OptionsType) {
    this.commonHeaders = options.headers
    this.baseUrl = options.baseUrl
    this.catchCode = options.catchCode
    this.bodyMixinForUser = options.bodyMixinForUser
    this.urlMixin = options.urlMixin
  }

  private fetchFactory (config: Request): Promise<CommonResponse<any>> {
    const self = this
    return new Promise((resolve, reject): void => {
      fetch(config).then((response: Response): any => {
        if (response.ok && response.status === 200) {
          return response.json()
        } else {
          reject(response)
        }
      }).then((res: CommonResponse<any>): void => {
        if (!res.code || res.code === 0) {
          resolve(res)
        } else {
          reject(res)
          self.catchCode && self.catchCode(res)
        }
      }).catch((err: CommonResponse<Error>): void => {
        reject(err)
        self.catchCode && self.catchCode(err)
      })
    })
  }

  private headerMixin (options: object = {}): Headers {
    return new Headers({
      ...defaultHeaders,
      ...this.commonHeaders,
      ...options
    })
  }

  private pathGen (path: string, body?: object): string {
    const fullPathReg = (path: string): boolean => /http(s)?:\/\//g.test(path)
    const fullPath = `${fullPathReg(path) ? '' : this.baseUrl}${path}`
    if (body) {
      return `${fullPath}${fullPath.includes('?') ? '&' : '?'}${qs.stringify(body)}`
    } else {
      return fullPath
    }
  }

  private bodyMixin (body: object = {}): object {
    return {
      ...body
    }
  }

  private bodyParser (body: object = {}, headers: Headers): string {
    const headerValue = headers.get('Content-Type')

    if (headerValue === 'application/x-www-form-urlencoded') {
      return qs.stringify(body)
    } else {
      return JSON.stringify(body)
    }
  }

  public get (
    path: string,
    body?: object,
    options?: MethodOptionType
  ): Promise<CommonResponse<any>> {
    const userHeader = options && options.headers
    const requestConfig: RequestInit = {
      method: 'GET',
      headers: this.headerMixin(userHeader),
      mode: 'cors',
      cache: 'default'
    }
    const url = this.urlMixin
      ? this.urlMixin(
        this.pathGen(
          path,
          this.bodyMixin(body)
        )
      )
      : this.pathGen(
        path,
        this.bodyMixin(body)
      )
    const request = new Request(url, requestConfig)

    return this.fetchFactory(request)
  }

  public post (
    path: string,
    body?: object,
    options?: MethodOptionType
  ): Promise<CommonResponse<any>> {
    const userHeader = options && options.headers
    const headers = this.headerMixin(userHeader)
    const bodyFn =
      _.isFunction(this.bodyMixinForUser)
        ? _.compose(this.bodyMixinForUser, this.bodyMixin)
        : this.bodyMixin

    const requestConfig: RequestInit = {
      method: 'POST',
      headers,
      mode: 'cors',
      cache: 'default',
      body: this.bodyParser(bodyFn(body), headers)
    }

    const url = this.urlMixin
      ? this.urlMixin(
        this.pathGen(path)
      )
      : this.pathGen(path)

    const request = new Request(url, requestConfig)

    return this.fetchFactory(request)
  }
}
