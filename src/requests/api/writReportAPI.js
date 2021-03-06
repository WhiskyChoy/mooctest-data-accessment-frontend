import http from '@/requests/http'
import {wait} from "@/utils/loadWaiter";

/**
 *
 * @param{String} writId
 */
const getWritReport = async (writId) => {
    if (process.env.VUE_APP_AJAX_VERSION === 'v0') {
        const {default: testReport} = await import('@/fake_data/json/test_report');
        const {fakeGetWrits} = await import('@/fake_data/js/dataPool');
        const data = fakeGetWrits({writId});
        if (!data || !data.result || data.result.length === 0) {
            return;
        }
        const writ = data.result[0];
        testReport.title = writ.title;
        testReport.time = writ.time;
        //模拟等一会
        await wait(1000);
        return testReport;
    }
    let URL;
    if (process.env.VUE_APP_AJAX_VERSION === 'v1') {
        URL = `/writ-report/${writId}/getWritReport`;
    }
    if (process.env.VUE_APP_AJAX_VERSION === 'v2') {
        URL = `/writ-report/${writId}`;
    }
    return http.get(URL);
};


/**
 * @param{Boolean} useDefault
 * @param{Array} config
 * @param{String} writId
 * @returns {Promise<*>}
 */
const postWritReport = async ({useDefault, config, writId} = {}) => {
    if (process.env.VUE_APP_AJAX_VERSION === 'v0') {
        await wait(500);
        return true;
    }
    let URL;
    if (process.env.VUE_APP_AJAX_VERSION === 'v1') {
        URL = '/writ-report/postWritReport';
    }
    if (process.env.VUE_APP_AJAX_VERSION === 'v2') {
        URL = '/writ-report'
    }
    return http.post(URL, {useDefault, config, writId});
};

export {getWritReport, postWritReport}