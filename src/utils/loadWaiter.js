import Vue from "vue"

function wait(time = 0) {
    return new Promise(r => setTimeout(r, time));
}

function waitVue() {
    return new Promise(resolve => Vue.nextTick(() => {
        resolve();
    }))
}


export {wait, waitVue}