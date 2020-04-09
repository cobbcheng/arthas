import Arthas, { OptionsType } from './arthas';
export { CommonResponse } from './arthas';
export { Arthas };
export default function createArthas(opt: OptionsType): {
    arthas: Arthas;
    useArthas: {
        (path: string, method: "get" | "post"): object;
        (path: string, method: "get" | "post", options: object): object;
        (path: string, method: "get" | "post", options: object, params: object): object;
    };
};
//# sourceMappingURL=index.d.ts.map