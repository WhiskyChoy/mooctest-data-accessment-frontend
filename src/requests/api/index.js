
const api = {};

const install = (Vue)=>{
    if(install.installed){
        return;
    }
    install.installed = true;
    Vue.$api = api;
    Object.defineProperties(Vue.prototype, {

        $api: {
            get() {
                return api
            }
        },

    })
};

export default install