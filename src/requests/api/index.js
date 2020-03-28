import {getWritReport, postWritReport} from "@/requests/api/writReportAPI";
import {getWrits, getWritStatus, postWrit} from "@/requests/api/writAPI";
import {getDefaultConfig, putDefaultConfig} from "@/requests/api/configAPI";
import {postTask, getTaskStatus, getTasks} from "@/requests/api/taskAPI";
import {getTaskReport, getTaskReportJSON, downloadTaskReportJSON} from "@/requests/api/taskReportAPI";
import {getUser, getAuthCode} from "@/requests/api/userAPI";

const api = {
    getWritReport, postWritReport, getWrits, getWritStatus, postWrit,
    getDefaultConfig, putDefaultConfig, postTask, getTaskStatus, getTasks,
    getTaskReport, getTaskReportJSON, downloadTaskReportJSON, getAuthCode, getUser
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