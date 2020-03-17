import http from '@/requests/http'
import {wait} from "@/utils/loadWaiter";

/**
 * @param{String} title
 * @param{Boolean} useDefault
 * @param{Array} config
 * @param{Array} writs
 * @returns {Promise<*>}
 */
const postTask = async ({title, useDefault, config, writs}) => {
    if (process.env.NODE_ENV === 'debug') {
        await wait(500);
        return true;
    }
    let URL;
    if (process.env.NODE_ENV === 'v1') {
        URL = '//task/postTask';
    }
    if (process.env.NODE_ENV === 'v2') {
        URL = '/task'
    }
    return http.post(URL, {title, useDefault, config, writs});
};

export {postTask}