import testReport from '@/fake_data/json/test_report'
import http from '@/requests/http'
import {wait} from "@/utils/loadWaiter";

/**
 *
 * @param{String} writId
 */
const getWritReport = async (writId) => {
    if (process.env.NODE_ENV === 'debug') {
        //模拟等一会
        await wait(1000);
        return testReport;
    }
    let URL;
    if (process.env.NODE_ENV === 'v1') {
        URL = `/writ-report/${writId}/getWrit`
    }
    if (process.env.NODE_ENV === 'v2') {
        URL = `/writ-report/${writId}`
    }
    return http.get(URL);
};

const postWritReport = async ({})=>{

};

export {getWritReport}