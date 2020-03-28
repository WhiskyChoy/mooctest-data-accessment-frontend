function safeFetch(obj, search = "", re = "") {
    const arr = search.split(".");
    if (!obj) {
        return re;
    }
    for (let i = 0; i < arr.length; i++) {
        let matcher;
        if (matcher = arr[i].match(/(.*)\[([0-9])]/)) {
            obj = obj[matcher[1]][matcher[2]];
        } else {
            obj = obj[arr[i]];
        }
        if (obj === undefined) {
            return re;
        }
    }
    return obj;
}


const install = (Vue) => {
    if (install.installed) {
        return;
    }
    install.installed = true;
    Vue.$safeFetch = safeFetch;
    Object.defineProperties(Vue.prototype, {
        $safeFetch: {
            get() {
                return safeFetch
            }
        },

    })
};

export default install