import { reactive, onMounted, toRefs } from '@vue/composition-api'
import Arthas from './arthas'

export const createUseArthas = (arthas: Arthas) => (
  path: string, 
  method: 'get' | 'post',
  options?: object, 
  params?: object
): object => {
  const data = reactive({
    code: null,
    data: undefined,
    msg: undefined
  })

  onMounted(async () => {
    try {
      const res = await arthas[method](path, options, params)
      data.code = res.code
      data.data = res.data
      data.msg = res.msg
    } catch (e) {
      data.code = e.code
      data.data = e.data
      data.msg = e.msg
    }
  })
  
  return toRefs(data)
}