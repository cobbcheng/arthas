import Arthas from './arthas';
import { createUseArthas } from './use-arthas';
export { Arthas };
export default function createArthas(opt) {
    const arthas = new Arthas(opt);
    const useArthas = createUseArthas(arthas);
    return {
        arthas,
        useArthas
    };
}
//# sourceMappingURL=index.js.map