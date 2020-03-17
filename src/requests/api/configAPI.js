import config_array from '@/fake_data/json/config_data'
import http from '@/requests/http'
import {wait} from "@/utils/loadWaiter";

//config获得的直接是一个数组，不是字典
//多一个result字段
/**
 * @returns {Promise<*>}
 */
const getDefaultConfig = async () => {
    if (process.env.NODE_ENV === 'debug') {
        //模拟等一会
        await wait(1000);
        return config_array;
    }

    let URL;
    if (process.env.NODE_ENV === 'v1') {
        URL = '/default-config/getDefaultConfig'
    }
    if (process.env.NODE_ENV === 'v2') {
        URL = '/default-config'
    }

    return http.get(URL);
};


/**
 * @param{Object} config
 * @returns {Promise<*>}
 */
const putDefaultConfig = async (config) => {
    if (process.env.NODE_ENV === 'debug') {
        console.log(config);
        //模拟等一会
        await wait(500);
        return true;
    }

    let URL;
    if (process.env.NODE_ENV === 'v1') {
        URL = '/default-config/putDefaultConfig'
    }
    if (process.env.NODE_ENV === 'v2') {
        URL = '/default-config'
    }

    return http.put(URL, config);

};

export {getDefaultConfig, putDefaultConfig}