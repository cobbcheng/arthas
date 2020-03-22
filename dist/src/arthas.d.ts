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
    transformRequest?(options: ParamsType): ParamsType;
}
export default class Arthas {
    baseUrl?: string;
    catchCode?(err: CommonResponse): void;
    transformRequest?(options: ParamsType): ParamsType;
    headers?: object;
    query?: object;
    body?: object;
    constructor(options: OptionsType);
    private createFetch;
    private headerMixin;
    private pathGen;
    private bodyMixin;
    private bodyParser;
    private runTransformRequest;
    private createRequest;
    get(path: string, body?: object, options?: ParamsType): Promise<CommonResponse>;
    post(path: string, body?: object, options?: ParamsType): Promise<CommonResponse>;
}
export {};
//# sourceMappingURL=arthas.d.ts.map