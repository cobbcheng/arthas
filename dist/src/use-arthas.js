/*
  hooks api for vue componsition-api
  chengkebin
*/
import { reactive, onMounted, toRefs } from '@vue/composition-api';
import { isObject } from './helper';
export function createUseArthas(arthas) {
    function useArthas(path, method, options, params) {
        const data = reactive({
            code: null,
            data: undefined,
            msg: undefined
        });
        if (!isObject(options)) {
            options = {};
        }
        if (!isObject(params)) {
            options = {};
        }
        onMounted(async () => {
            let res;
            try {
                res = await arthas[method](path, options, params);
            }
            catch (e) {
                res = e;
            }
            finally {
                data.code = res.code;
                data.data = res.data;
                data.msg = res.msg;
            }
        });
        return toRefs(data);
    }
    return useArthas;
}
//# sourceMappingURL=use-arthas.js.map