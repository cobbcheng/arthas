import Arthas, { OptionsType } from './arthas';
export { CommonResponse } from './arthas';
export default function createArthas(opt: OptionsType): {
    arthas: Arthas;
    useArthas: (path: string, method: "get" | "post", options?: object | undefined, params?: object | undefined) => object;
};
//# sourceMappingURL=index.d.ts.map