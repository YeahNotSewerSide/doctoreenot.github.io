    let cachegetUint8Memory0 = null;
    function getUint8Memory0(wasm) {
        if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.instance.exports.memory.buffer) {
            cachegetUint8Memory0 = new Uint8Array(wasm.instance.exports.memory.buffer);
        }
        return cachegetUint8Memory0;
    }

    let WASM_VECTOR_LEN = 0;

    function passArray8ToWasm0(arg, malloc, wasm) {
        const ptr = malloc(arg.length * 1);
        getUint8Memory0(wasm).set(arg, ptr / 1);
        WASM_VECTOR_LEN = arg.length;
        return ptr;
    }

    let cachegetInt32Memory0 = null;
    function getInt32Memory0(wasm) {
        if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.instance.exports.memory.buffer) {
            cachegetInt32Memory0 = new Int32Array(wasm.instance.exports.memory.buffer);
        }
        return cachegetInt32Memory0;
    }

    function getArrayU8FromWasm0(ptr, len, wasm) {
        return getUint8Memory0(wasm).subarray(ptr / 1, ptr / 1 + len);
    }
    /**
    * @param {Uint8Array} data
    * @returns {Uint8Array}
    */
    function sha1_digest(data,wasm) {
        try {
            const retptr = wasm.instance.exports.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passArray8ToWasm0(data, wasm.instance.exports.__wbindgen_malloc, wasm);
            var len0 = WASM_VECTOR_LEN;
            wasm.instance.exports.sha1_digest(retptr, ptr0, len0);
            var r0 = getInt32Memory0(wasm)[retptr / 4 + 0];
            var r1 = getInt32Memory0(wasm)[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1, wasm).slice();
            wasm.instance.exports.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.instance.exports.__wbindgen_add_to_stack_pointer(16);
        }
    }

