import Arthas, { OptionsType } from './arthas'
import { createUseArthas } from './use-arthas'

export { CommonResponse } from './arthas'

export function createArthas (opt: OptionsType) {
  const arthas: Arthas = new Arthas(opt)
  const useArthas = createUseArthas(arthas)

  return {
    arthas,
    useArthas
  }
}

export default Arthas
