import Arthas, { OptionsType } from './arthas';
export { CommonResponse } from './arthas';
export declare function createArthas(opt: OptionsType): {
    arthas: Arthas;
    useArthas: {
        (path: string, method: "get" | "post"): import("./arthas").CommonResponse;
        (path: string, method: "get" | "post", options: object): import("./arthas").CommonResponse;
        (path: string, method: "get" | "post", options: object, params: object): import("./arthas").CommonResponse;
    };
};
export default Arthas;
//# sourceMappingURL=index.d.ts.map