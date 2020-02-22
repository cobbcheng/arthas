"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qs_1 = __importDefault(require("qs"));
const utils_1 = __importDefault(require("./utils"));
const defaultHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json, text/plain, */*'
};
class Arthas {
    constructor(options) {
        this.commonHeaders = options.headers;
        this.baseUrl = options.baseUrl;
        this.catchCode = options.catchCode;
        this.bodyMixinForUser = options.bodyMixinForUser;
        this.urlMixin = options.urlMixin;
    }
    fetchFactory(config) {
        const self = this;
        return new Promise((resolve, reject) => {
            fetch(config).then((response) => {
                if (response.ok && response.status === 200) {
                    return response.json();
                }
                else {
                    reject(response);
                }
            }).then((res) => {
                if (!res.code || res.code === 0) {
                    resolve(res);
                }
                else {
                    reject(res);
                    self.catchCode && self.catchCode(res);
                }
            }).catch((err) => {
                reject(err);
                self.catchCode && self.catchCode(err);
            });
        });
    }
    headerMixin(options = {}) {
        return new Headers(Object.assign(Object.assign(Object.assign({}, defaultHeaders), this.commonHeaders), options));
    }
    pathGen(path, body) {
        const fullPathReg = (path) => /http(s)?:\/\//g.test(path);
        const fullPath = `${fullPathReg(path) ? '' : this.baseUrl}${path}`;
        if (body) {
            return `${fullPath}${fullPath.includes('?') ? '&' : '?'}${qs_1.default.stringify(body)}`;
        }
        else {
            return fullPath;
        }
    }
    bodyMixin(body = {}) {
        return Object.assign({}, body);
    }
    bodyParser(body = {}, headers) {
        const headerValue = headers.get('Content-Type');
        if (headerValue === 'application/x-www-form-urlencoded') {
            return qs_1.default.stringify(body);
        }
        else {
            return JSON.stringify(body);
        }
    }
    get(path, body, options) {
        const userHeader = options && options.headers;
        const requestConfig = {
            method: 'GET',
            headers: this.headerMixin(userHeader),
            mode: 'cors',
            cache: 'default'
        };
        const url = this.urlMixin
            ? this.urlMixin(this.pathGen(path, this.bodyMixin(body)))
            : this.pathGen(path, this.bodyMixin(body));
        const request = new Request(url, requestConfig);
        return this.fetchFactory(request);
    }
    post(path, body, options) {
        const userHeader = options && options.headers;
        const headers = this.headerMixin(userHeader);
        const bodyFn = utils_1.default.isFunction(this.bodyMixinForUser)
            ? utils_1.default.compose(this.bodyMixinForUser, this.bodyMixin)
            : this.bodyMixin;
        const requestConfig = {
            method: 'POST',
            headers,
            mode: 'cors',
            cache: 'default',
            body: this.bodyParser(bodyFn(body), headers)
        };
        const url = this.urlMixin
            ? this.urlMixin(this.pathGen(path))
            : this.pathGen(path);
        const request = new Request(url, requestConfig);
        return this.fetchFactory(request);
    }
}
exports.default = Arthas;
