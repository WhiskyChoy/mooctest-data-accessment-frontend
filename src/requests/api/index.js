import {getWritReport, postWritReport} from "@/requests/api/writReportAPI";
import {getWrits, getWritStatus, postWrit} from "@/requests/api/writAPI";
import {getDefaultConfig, putDefaultConfig} from "@/requests/api/configAPI";
import {postTask} from "@/requests/api/taskAPI";

const api = {
    getWritReport, postWritReport, getWrits, getWritStatus, postWrit,
    getDefaultConfig, putDefaultConfig, postTask
};

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