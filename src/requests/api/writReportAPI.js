import testReport from '@/fake_data/json/test_report'
import http from '@/requests/http'
import {wait} from "@/utils/loadWaiter";

/**
 *
 * @param{String} writId
 */
const getWritReport = async (writId) => {
    if (process.env.VUE_APP_AJAX_VERSION === 'v0') {
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
const postWritReport = async ({useDefault, config, writId}) => {
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