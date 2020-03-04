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

import querystring from './querystring'

export interface CommonResponse<T> extends Response {
  code: number;
  msg?: string|null;
  data: T;
}

class ParamsType {
  headers?: object;
  query?: object;
  body?: object;
}

class OptionsType extends ParamsType {
  baseUrl?: string;
  catchCode?(err: CommonResponse<Error>): void;
  transformRequest?(options: ParamsType): ParamsType
}

const defaultHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded',
  Accept: 'application/json, text/plain, */*'
}

export default class Arthas extends OptionsType {
  constructor (options: OptionsType) {
    super()
    this.headers = options.headers || {}
    this.query = options.query || {}
    this.body = options.body || {}
    this.baseUrl = options.baseUrl || '/'
    this.catchCode = options.catchCode
    this.transformRequest = options.transformRequest
  }

  private fetchFactory (config: Request): Promise<CommonResponse<any>> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
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
      ...this.headers,
      ...options
    })
  }

  private pathGen (path: string, body = {}, customQuery = {}): string {
    const fullPath = `${/http(s)?:\/\//g.test(path) ? '' : this.baseUrl}${path}`
    const querySign = fullPath.includes('?') ? '&' : '?'
    const query = {
      ...body,
      ...customQuery
    }

    if (Object.keys(query).length === 0) {
      return fullPath
    } else {
      return `${fullPath}${querySign}${querystring(query)}`
    }
  }

  private bodyMixin (body: object = {}): object {
    return {
      ...this.body,
      ...body
    }
  }

  private bodyParser (body: object = {}, headers: Headers): string {
    const headerValue = headers.get('Content-Type')

    if (headerValue === 'application/x-www-form-urlencoded') {
      return querystring(body)
    } else {
      return JSON.stringify(body)
    }
  }

  private runTransformRequest () {
    if (typeof this.transformRequest !== 'function') {
      return
    }

    const params = this.transformRequest({
      headers: this.headers,
      body: this.body,
      query: this.query
    })

    if (Object.prototype.toString.call(params) === '[object Object]') {
      this.headers = {
        ...this.headers,
        ...params.headers
      }
      this.query = {
        ...this.query,
        ...params.query
      }
      this.body = {
        ...this.body,
        ...params.body
      }
    }
  }

  public get (
    path: string,
    body?: object,
    options: ParamsType = {}
  ): Promise<CommonResponse<any>> {
    this.runTransformRequest()
    const requestConfig: RequestInit = {
      method: 'GET',
      headers: this.headerMixin(options.headers),
      mode: 'cors',
      cache: 'default'
    }
    const url = this.pathGen(
      path,
      this.bodyMixin(body),
      this.query
    )
    const request = new Request(url, requestConfig)

    return this.fetchFactory(request)
  }

  public post (
    path: string,
    body?: object,
    options: ParamsType = {}
  ): Promise<CommonResponse<any>> {
    this.runTransformRequest()
    const headers = this.headerMixin(options.headers)

    const requestConfig: RequestInit = {
      method: 'POST',
      headers,
      mode: 'cors',
      cache: 'default',
      body: this.bodyParser(this.bodyMixin(body), headers)
    }

    const url = this.pathGen(path, {}, {
      ...this.query,
      ...options.query
    })

    const request = new Request(url, requestConfig)

    return this.fetchFactory(request)
  }
}
