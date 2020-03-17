import {getWritList} from '@/fake_data/js/writ_list'
import http from '@/requests/http'
import {wait} from "@/utils/loadWaiter";

/**
 * @param{String} nameStr
 * @param{Date} startDate
 * @param{Date} endDate
 */
const getWrits = async ({nameStr, startDate, endDate}) => {
    if (process.env.NODE_ENV === 'debug') {
        //模拟等一会
        await wait(1000);
        return getWritList();
    }
    const name = nameStr ? nameStr : '';
    const startTime = startDate && startDate.getTime ? startDate.getTime() : '';
    const endTime = endDate && endDate.getTime ? endDate.getTime() : '';
    let URL;
    if (process.env.NODE_ENV === 'v1') {
        URL = '/writ/getWrits'
    }
    if (process.env.NODE_ENV === 'v2') {
        URL = '/writ'
    }
    // 这里不用return await，async函数遇到返回值为Promise的情况：
    // 本来就是去掉async变成普通函数，返回Promise.resolve(return_val)
    // 而Promise.resolve(Promise.resolve(return_val))和Promise.resolve(await Promise.resolve(return_val))相当于是一样的
    // 本来就要等待
    //get要给params来传参
    return http.get(URL, {params: {name, startTime, endTime}});
};

/**
 *
 * @param{String} writId
 */
const getWritStatus = async (writId) => {
    if (process.env.NODE_ENV === 'debug') {
        //模拟等一会
        await wait(1000);
        return 'finished';
    }
    let URL;
    if (process.env.NODE_ENV === 'v1') {
        URL = `/writ/${writId}/status/getWritStatus`
    }
    if (process.env.NODE_ENV === 'v2') {
        URL = `/writ/${writId}/status`
    }
    return http.get(URL);
};

export {getWrits, getWritStatus}