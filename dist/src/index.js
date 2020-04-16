import Arthas from './arthas';
import { createUseArthas } from './use-arthas';
export function createArthas(opt) {
    const arthas = new Arthas(opt);
    const useArthas = createUseArthas(arthas);
    return {
        arthas,
        useArthas
    };
}
export default Arthas;
//# sourceMappingURL=index.js.map