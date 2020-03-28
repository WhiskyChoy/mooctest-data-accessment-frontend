import testTaskReport from '@/fake_data/json/test_task_report'
import http from '@/requests/http'
import {wait} from "@/utils/loadWaiter";

/**
 *
 * @param{String} taskId
 */
const getTaskReport = async (taskId) => {
    if (process.env.VUE_APP_AJAX_VERSION === 'v0') {
        //模拟等一会
        await wait(1000);
        return testTaskReport;
    }
    let URL;
    if (process.env.VUE_APP_AJAX_VERSION === 'v1') {
        URL = `/task-report/${taskId}/getTaskReport`;
    }
    if (process.env.VUE_APP_AJAX_VERSION === 'v2') {
        URL = `/task-report/${taskId}`;
    }
    return http.get(URL);
};

const getTaskReportJSON = async (taskId) => {
    if (process.env.VUE_APP_AJAX_VERSION === 'v0') {
        //模拟等一会
        await wait(200);
        return 'https://geo.datav.aliyun.com/areas/bound/100000.json';
    }
    let URL;
    if (process.env.VUE_APP_AJAX_VERSION === 'v1') {
        URL = `/task-report/${taskId}/json/getTaskReportJSON`;
    }
    if (process.env.VUE_APP_AJAX_VERSION === 'v2') {
        URL = `/task-report/${taskId}/json`;
    }
    return http.get(URL);
};


const downloadTaskReportJSON = async (URL) => {
    return http.get(URL, {responseType: 'blob'})
};

export {getTaskReport, getTaskReportJSON, downloadTaskReportJSON}