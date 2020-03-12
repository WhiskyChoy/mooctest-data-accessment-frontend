import {getWritList} from '@/fake_data/js/writ_list'
import http from '@/requests/http'
import {wait} from "@/utils/loadWaiter";

/**
 *
 * @param{String} name
 * @param{Date} startDate
 * @param{Date} endDate
 */
const getWrits = async ({name, startDate, endDate}) => {
    const startTime = startDate && startDate.getTime ? startDate.getTime() : '';
    const endTime = endDate && endDate.getTime ? endDate.getTime() : '';
    if (process.env.NODE_ENV === 'debug') {
        //模拟等一会
        await wait(1000);
        return getWritList();
    }
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
    return http.get(URL, {params: {name, startTime, endTime}});
};

export {getWrits}