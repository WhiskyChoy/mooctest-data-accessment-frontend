import testTaskReport from '@/fake_data/json/test_task_report'
import http from '@/requests/http'
import {wait} from "@/utils/loadWaiter";

/**
 *
 * @param{String} taskId
 */
const getTaskReport = async (taskId) => {
    if (process.env.NODE_ENV === 'debug') {
        //模拟等一会
        await wait(1000);
        return testTaskReport;
    }
    let URL;
    if (process.env.NODE_ENV === 'v1') {
        URL = `/task-report/${taskId}/getTaskReport`;
    }
    if (process.env.NODE_ENV === 'v2') {
        URL = `/task-report/${taskId}`;
    }
    return http.get(URL);
};

const getTaskReportJSON = async (taskId) => {
    if (process.env.NODE_ENV === 'debug') {
        //模拟等一会
        await wait(200);
        return 'a.json';
    }
    let URL;
    if (process.env.NODE_ENV === 'v1') {
        URL = `/task-report/${taskId}/json/getTaskReportJSON`;
    }
    if (process.env.NODE_ENV === 'v2') {
        URL = `/task-report/${taskId}/json`;
    }
    return http.get(URL);
};

export {getTaskReport, getTaskReportJSON}