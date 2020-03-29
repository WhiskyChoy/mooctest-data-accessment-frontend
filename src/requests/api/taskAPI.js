import http from '@/requests/http'
import {wait} from "@/utils/loadWaiter";

/**
 * @param{String} title
 * @param{Boolean} useDefault
 * @param{Array} config
 * @param{Array} writs
 * @returns {Promise<*>}
 */
const postTask = async ({title, useDefault, config, writs} = {}) => {
    if (process.env.VUE_APP_AJAX_VERSION === 'v0') {
        await wait(500);
        return true;
    }
    let URL;
    if (process.env.VUE_APP_AJAX_VERSION === 'v1') {
        URL = '//task/postTask';
    }
    if (process.env.VUE_APP_AJAX_VERSION === 'v2') {
        URL = '/task'
    }
    return http.post(URL, {title, useDefault, config, writs});
};


const getTaskStatus = async (taskId) => {
    if (process.env.VUE_APP_AJAX_VERSION === 'v0') {
        //模拟等一会
        await wait(1000);
        return 'finished';
    }
    let URL;
    if (process.env.VUE_APP_AJAX_VERSION === 'v1') {
        URL = `/task/${taskId}/status/getTaskStatus`
    }
    if (process.env.VUE_APP_AJAX_VERSION === 'v2') {
        URL = `/task/${taskId}/status`
    }
    return http.get(URL);
};

const getTasks = async ({nameStr, startDate, endDate} = {}) => {
    if (process.env.VUE_APP_AJAX_VERSION === 'v0') {
        const {fakeGetTasks} = await import('@/fake_data/js/dataPool');
        //模拟等一会
        await wait(1000);
        return fakeGetTasks({nameStr, startDate, endDate});
    }
    const name = nameStr ? nameStr : '';
    const startTime = startDate && startDate.getTime ? startDate.getTime() : '';
    const endTime = endDate && endDate.getTime ? endDate.getTime() : '';
    let URL;
    if (process.env.VUE_APP_AJAX_VERSION === 'v1') {
        URL = '/task/getTasks'
    }
    if (process.env.VUE_APP_AJAX_VERSION === 'v2') {
        URL = '/task'
    }
    // 这里不用return await，async函数遇到返回值为Promise的情况：
    // 本来就是去掉async变成普通函数，返回Promise.resolve(return_val)
    // 而Promise.resolve(Promise.resolve(return_val))和Promise.resolve(await Promise.resolve(return_val))相当于是一样的
    // 本来就要等待
    //get要给params来传参
    return http.get(URL, {params: {name, startTime, endTime}});
};

export {postTask, getTaskStatus, getTasks}