/* 
  hooks api for vue componsition-api
  chengkebin
*/
import { reactive, onMounted, toRefs } from '@vue/composition-api'
import Arthas, { CommonResponse } from './arthas'
import { isObject } from './helper'

export function createUseArthas (arthas: Arthas) {
  function useArthas (path: string, method: 'get' | 'post'): CommonResponse
  function useArthas (path: string, method: 'get' | 'post', options: object): CommonResponse
  function useArthas (path: string, method: 'get' | 'post', options: object, params: object): CommonResponse
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