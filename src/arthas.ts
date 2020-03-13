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
 * 统一传参：query查询，body请求参数，header请求头，皆为object类型
 * 统一返回：object: { data, msg, code }，code包括2xx-5xx，以及约定的0-xxxxx（eg：20102等）
 *
 */

import querystring from './querystring'

export interface CommonResponse {
  code: any;
  msg?: any;
  data: any;
}

interface ParamsType {
  headers?: object;
  query?: object;
  body?: object;
}

export interface OptionsType extends ParamsType {
  baseUrl?: string;
  catchCode?(err: CommonResponse): void;
  transformRequest?(options: ParamsType): ParamsType
}

const defaultHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded',
  Accept: 'application/json, text/plain, */*'
}

export default class Arthas {
  baseUrl?: string;
  catchCode?(err: CommonResponse): void;
  transformRequest?(options: ParamsType): ParamsType
  headers?: object
  query?: object
  body?: object

  constructor (options: OptionsType) {
    this.headers = options.headers || {}
    this.query = options.query || {}
    this.body = options.body || {}
    this.baseUrl = options.baseUrl || '/'
    this.catchCode = options.catchCode
    this.transformRequest = options.transformRequest
  }

  private createFetch (config: Request): Promise<CommonResponse> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const catchCode = this.catchCode
    const cerateErrData = (err: Response): CommonResponse => ({
      code: err.status,
      msg: '',
      data: null
    })

    return new Promise((resolve, reject): void => {
      function handleError (err: Response) {
        const errData = cerateErrData(err)
        catchCode && catchCode(errData)
        reject(errData)
      }

      fetch(config).then((response: Response): any => {
        if (response.ok) {
          return response.json()
        } else {
          handleError(response)
        }
      }).then((res: CommonResponse): void => {
        if (res.code === 0) {
          resolve(res)
        } else {
          catchCode && catchCode(res)
          reject(res)
        }
      }).catch((err: Response): void => {
        handleError(err)
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
  ): Promise<CommonResponse> {
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

    return this.createFetch(request)
  }

  public post (
    path: string,
    body?: object,
    options: ParamsType = {}
  ): Promise<CommonResponse> {
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

    return this.createFetch(request)
  }
}
