const writStatusTable = {
    untested: '尚未检测',
    waiting: '等待检测',
    ongoing: '在检测中',
    finished: '检测完成',
    wrong: '解析错误',
    accident: '意外中断',
};

const taskStatusTable = {
    waiting: '等待检测',
    ongoing: '在检测中',
    finished: '检测完成',
    failed: '检测失败',
};

const tableToList = (dict, key, value) => {
    const result = [];
    Object.keys(dict).forEach(dictKey => {
        const obj = {};
        const dictValue = dict[dictKey];
        obj[key] = dictKey;
        obj[value] = dictValue;
        result.push(obj);
    });
    return result;
};

const writStatusList = tableToList(writStatusTable, 'value', 'label');

const taskStatusList = tableToList(taskStatusTable, 'value', 'label');

export {writStatusTable, taskStatusTable, writStatusList, taskStatusList}


