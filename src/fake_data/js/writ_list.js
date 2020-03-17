//按webpack的规则，import不带尾缀的话一个文件夹里的文件类型应该是一样的，所以js和json分开放
const keyWords = ['非法占有', '交通犯罪', '人身损害', '寻衅滋事', '伪造', '扣押'];
const courts = ['北京市高级', '苏州市中级', '中山市中级', '广东省高级', '湖南省高级', '浙江省高级'];
// untested, waiting, onging, finished, wrong, accident
const listStatus = ['untested', 'waiting', 'onging', 'finished', 'wrong', 'accident'];

let counter = 0;
const get_id = () => {
    return ++counter;

};

const randomDate = (startDate, endDate) => {
    return new Date(startDate.getTime() + Math.floor(Math.random() * (endDate.getTime() - startDate.getTime())));
};

const startDate = new Date(2010, 0, 24, 11, 33, 0);
const endDate = new Date();


const get_one_item = () => {
    return {
        id: get_id(),
        title: courts[Math.floor(Math.random() * (courts.length))] + '人民法院' + keyWords[Math.floor(Math.random() * (keyWords.length))] + '类合编',
        time: randomDate(startDate, endDate),
        length: Math.floor(100 + Math.random() * 1000),
        status: listStatus[Math.floor(Math.random() * listStatus.length)]
    }
};


const getWritList = (num = 20) => {
    let writList = [];

    for (let i = 0; i < num; i++) {
        writList.push(get_one_item())
    }
    return writList;
};

export {getWritList}