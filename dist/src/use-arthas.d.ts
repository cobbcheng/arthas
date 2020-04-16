import Arthas, { CommonResponse } from './arthas';
export declare function createUseArthas(arthas: Arthas): {
    (path: string, method: "get" | "post"): CommonResponse;
    (path: string, method: "get" | "post", options: object): CommonResponse;
    (path: string, method: "get" | "post", options: object, params: object): CommonResponse;
};
//# sourceMappingURL=use-arthas.d.ts.map