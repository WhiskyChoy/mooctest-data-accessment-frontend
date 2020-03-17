import {getWritReport} from "@/requests/api/writReportAPI";
import {getWrits, getWritStatus} from "@/requests/api/writAPI";
import {getDefaultConfig, putDefaultConfig} from "@/requests/api/configAPI";

const api = {getWritReport, getWrits, getWritStatus, getDefaultConfig, putDefaultConfig};

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