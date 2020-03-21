//按webpack的规则，import不带尾缀的话一个文件夹里的文件类型应该是一样的，所以js和json分开放
const keyWords = ['非法占有', '交通犯罪', '人身损害', '寻衅滋事', '伪造', '扣押'];
const courts = ['北京市高级', '苏州市中级', '中山市中级', '广东省高级', '湖南省高级', '浙江省高级'];
// untested, waiting, ongoing, finished, wrong, accident
const writListStatus = ['untested', 'waiting', 'ongoing', 'finished', 'wrong', 'accident'];
const taskListStatus = ['waiting', 'ongoing', 'finished', 'failed'];


const randomDate = (startDate, endDate) => {
    return new Date(startDate.getTime() + Math.floor(Math.random() * (endDate.getTime() - startDate.getTime())));
};

const startDate = new Date(2010, 0, 24, 11, 33, 0);
const endDate = new Date();


const get_one_item = (type) => {
    const maxId = 1000;
    let suffix = '';
    let statusList = [];
    if (type === 'writ') {
        suffix = '案件';
        statusList = writListStatus;
    }
    if (type === 'task') {
        suffix = '类合编';
        statusList = taskListStatus;
    }
    return {
        id: Math.ceil(Math.random() * maxId),
        title: courts[Math.floor(Math.random() * (courts.length))] + '人民法院' + keyWords[Math.floor(Math.random() * (keyWords.length))] + suffix,
        time: randomDate(startDate, endDate),
        length: Math.floor(100 + Math.random() * 1000),
        status: statusList[Math.floor(Math.random() * statusList.length)]
    }
};


const getWritList = (num = 20) => {
    let writList = [];

    for (let i = 0; i < num; i++) {
        writList.push(get_one_item('writ'))
    }
    return writList;
};

const getTaskList = (num = 20) => {
    let taskList = [];

    for (let i = 0; i < num; i++) {
        taskList.push(get_one_item('task'))
    }
    return taskList;
};

export {getWritList, getTaskList}