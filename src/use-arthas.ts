import { reactive, onMounted, toRefs } from '@vue/composition-api'
import Arthas, { isObject } from './arthas'

export function createUseArthas (arthas: Arthas) {
  function useArthas (path: string, method: 'get' | 'post'): object
  function useArthas (path: string, method: 'get' | 'post', options: object): object
  function useArthas (path: string, method: 'get' | 'post', options: object, params: object): object
  function useArthas (
    path: string,
    method: 'get' | 'post',
    options?: any,
    params?: any
  ): object {
    const data = reactive({
      code: null,
      data: undefined,
      msg: undefined
    })

    if (!isObject(options)) {
      options = {}
    }
    if (!isObject(params)) {
      options = {}
    }

    onMounted(async () => {
      let res
      try {
        res = await arthas[method](path, options, params)
      } catch (e) {
        res = e
      } finally {
        data.code = res.code
        data.data = res.data
        data.msg = res.msg
      }
    })

    return toRefs(data)
  }

  return useArthas
}