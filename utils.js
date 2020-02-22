"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = {
    compose(...args) {
        // const args = arguments
        const start = args.length - 1;
        return function () {
            let i = start;
            let result = args[start].apply(this, arguments);
            while (i--)
                result = args[i].call(this, result);
            return result;
        };
    },
    isFunction(obj) {
        return typeof obj == 'function' || false;
    }
};
exports.default = _;
