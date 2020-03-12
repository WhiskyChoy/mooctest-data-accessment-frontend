import {getWritReport} from "@/requests/api/writReportAPI";
import {getWrits} from "@/requests/api/writAPI";

const api = {getWritReport, getWrits};

const install = (Vue) => {
    if (install.installed) {
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