import Vue from "vue"

function wait(time = 0) {
    return new Promise(r => setTimeout(r, time));
}

function waitVue() {
    return Vue.nextTick();
}


export {wait, waitVue}