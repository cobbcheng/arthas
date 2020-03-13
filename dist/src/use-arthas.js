import { reactive, onMounted, toRefs } from '@vue/composition-api';
export const createUseArthas = (arthas) => (path, method, options, params) => {
    const data = reactive({
        code: null,
        data: undefined,
        msg: undefined
    });
    onMounted(async () => {
        try {
            const res = await arthas[method](path, options, params);
            data.code = res.code;
            data.data = res.data;
            data.msg = res.msg;
        }
        catch (e) {
            data.code = e.code;
            data.data = e.data;
            data.msg = e.msg;
        }
    });
    return toRefs(data);
};
//# sourceMappingURL=use-arthas.js.map