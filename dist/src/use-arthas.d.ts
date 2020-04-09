import Arthas from './arthas';
export declare function createUseArthas(arthas: Arthas): {
    (path: string, method: "get" | "post"): object;
    (path: string, method: "get" | "post", options: object): object;
    (path: string, method: "get" | "post", options: object, params: object): object;
};
//# sourceMappingURL=use-arthas.d.ts.map