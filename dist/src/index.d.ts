import Arthas, { OptionsType } from './arthas';
export { CommonResponse } from './arthas';
export { Arthas };
export default function createArthas(opt: OptionsType): {
    arthas: Arthas;
    useArthas: {
        (path: string, method: "get" | "post"): import("./arthas").CommonResponse;
        (path: string, method: "get" | "post", options: object): import("./arthas").CommonResponse;
        (path: string, method: "get" | "post", options: object, params: object): import("./arthas").CommonResponse;
    };
};
//# sourceMappingURL=index.d.ts.map