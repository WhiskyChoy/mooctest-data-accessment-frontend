import http from '@/requests/http'
import {wait} from "@/utils/loadWaiter";

/**
 *
 * @param{String} taskId
 */
const getTaskReport = async (taskId) => {
    if (process.env.VUE_APP_AJAX_VERSION === 'v0') {
        //模拟等一会
        const {default: testTaskReport} = await import('@/fake_data/json/test_task_report');
        const {fakeGetTasks} = await import('@/fake_data/js/dataPool');
        const data = fakeGetTasks({taskId});
        if (!data || !data.result || data.result.length === 0) {
            return;
        }
        const task = data.result[0];
        testTaskReport.task_name = task.title;
        testTaskReport.task_time = task.time;
        testTaskReport.writ_num = task.length;
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
        return http.get('https://geo.datav.aliyun.com/areas/bound/100000.json', {responseType: 'blob'});
    }
    let URL;
    if (process.env.VUE_APP_AJAX_VERSION === 'v1') {
        URL = `/task-report/${taskId}/json/getTaskReportJSON`;
    }
    if (process.env.VUE_APP_AJAX_VERSION === 'v2') {
        URL = `/task-report/${taskId}/json`;
    }
    return http.get(URL, {responseType: 'blob'});
};

export {getTaskReport, getTaskReportJSON}