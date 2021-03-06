import http from '@/requests/http'
import {wait} from "@/utils/loadWaiter";

/**
 * @param{String} nameStr
 * @param{Date} startDate
 * @param{Date} endDate
 * @param{String} taskId
 * @param{Number} pageIndex
 * @param{Number} pageSize
 * @param{String} status
 * @param{String} year
 * @param{String} province
 */
const getWrits = async ({nameStr, startDate, endDate, taskId, pageIndex, pageSize, status, year, province} = {}) => {
    if (process.env.VUE_APP_AJAX_VERSION === 'v0') {
        const {fakeGetWrits} = await import('@/fake_data/js/dataPool');
        //模拟等一会
        await wait(1000);
        return fakeGetWrits({nameStr, startDate, endDate, taskId, pageIndex, pageSize, status});
    }
    let URL;
    if (process.env.VUE_APP_AJAX_VERSION === 'v1') {
        URL = '/writ/getWrits'
    }
    if (process.env.VUE_APP_AJAX_VERSION === 'v2') {
        URL = '/writ'
    }
    //给taskId的情况下先不给复合搜索了
    // if (taskId) {
    //     return http.get(URL, {params: {taskId}});
    // }
    const name = nameStr || null;
    const startTime = startDate && startDate.getTime ? startDate.getTime() : null;
    const endTime = endDate && endDate.getTime ? endDate.getTime() : null;
    // 这里不用return await，async函数遇到返回值为Promise的情况：
    // 本来就是去掉async变成普通函数，返回Promise.resolve(return_val)
    // 而Promise.resolve(Promise.resolve(return_val))和Promise.resolve(await Promise.resolve(return_val))相当于是一样的
    // 本来就要等待
    //get要给params来传参
    return http.get(URL, {
        params: {
            name,
            startTime,
            endTime,
            taskId,
            pageIndex,
            pageSize,
            status,
            year,
            province
        }
    });
};

/**
 *
 * @param{String} writId
 */
const getWritStatus = async (writId) => {
    if (process.env.VUE_APP_AJAX_VERSION === 'v0') {
        //模拟等一会
        await wait(1000);
        return 'ongoing';
    }
    let URL;
    if (process.env.VUE_APP_AJAX_VERSION === 'v1') {
        URL = `/writ/${writId}/status/getWritStatus`
    }
    if (process.env.VUE_APP_AJAX_VERSION === 'v2') {
        URL = `/writ/${writId}/status`
    }
    return http.get(URL);
};


const randomDistribute = (offer, servingNum) => {
    let result = [];
    let total = 1;
    for (let i = 0; i < servingNum - 1; i++) {
        let serving = total * Math.random();
        result.push(offer * serving);
        total -= serving;
    }
    result.push(offer * total);
    return result;
};

/**
 * @param{Blob} file
 * @param{Function} onProgress
 * @returns {Promise<*>}
 */
const postWrit = async ({file, onProgress}) => {
    if (process.env.VUE_APP_AJAX_VERSION === 'v0') {
        //上传失败率failRate
        const failRate = 0;
        if (Math.random() < failRate) {
            return false;
        }
        const steps = 10;
        const totalProgress = 100;
        const totalTime = 2000;
        const progress = randomDistribute(totalProgress, steps);
        let currentProgress = 0;
        const time = randomDistribute(totalTime, steps);
        for (let i = 0; i < steps; i++) {
            await wait(time[i]);
            onProgress({percent: currentProgress += progress[i]});
        }
        return true;
    }
    if (process.env.VUE_APP_AJAX_VERSION === 'v1') {
        URL = `/writ/postWrit`
    }
    if (process.env.VUE_APP_AJAX_VERSION === 'v2') {
        URL = `/writ`
    }
    const formData = new FormData();
    formData.append('file', file, file.name);
    // 用户在el-upload传入的on-progress只是el-upload自身执行的handleOnProgress的一部分
    // 下方为源代码：
    /* handleProgress(ev, rawFile) {
         const file = this.getFile(rawFile);
         this.onProgress(ev, file, this.uploadFiles);
         file.status = 'uploading';
         file.percentage = ev.percent || 0;
    },
    */
    const configs = {
        headers: {'Content-Type': 'multipart/form-data'},
        onUploadProgress: (e) => {
            if (e.total > 0) {
                e.percent = e.loaded / e.total * 100;
            }
            onProgress(e);
        }
    };
    return http.post(URL, formData, configs);
};


export {getWrits, getWritStatus, postWrit}