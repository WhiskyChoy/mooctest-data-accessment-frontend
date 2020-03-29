import rawCourts from '../json/courts'

const getRandomNum = (startNum, endNum) => {
    return startNum + Math.floor((endNum - startNum) * Math.random());
};

const randomArray = (array) => {
    return array[getRandomNum(0, array.length)];
};

const shuffleArray = (array, size) => {
    let index = -1,
        length = array.length,
        lastIndex = length - 1;

    size = size || length;
    while (++index < size) {
        let rand = getRandomNum(index, lastIndex),
            value = array[rand];

        array[rand] = array[index];
        array[index] = value;
    }
    array.length = size;
    return array;
};

Array.prototype.random || (Array.prototype.random = function () {
    return randomArray(this);
});

Array.prototype.shuffle || (Array.prototype.shuffle = function (size) {
    return shuffleArray(this, size);
});

const startDate = new Date(2020, 0, 24, 11, 33, 0);
const endDate = new Date();
const remainCourtNum = 200;
const untestedWritNum = 20;
const maxWritNum = 64;


const taskStatusList = ['waiting', 'ongoing', 'finished', 'failed'];

const materialTypes = ['民事判决书', '民事调解书', '民事裁定书'];

const getRandomDate = (startDate, endDate) => {
    return new Date(startDate.getTime() + Math.floor(Math.random() * (endDate.getTime() - startDate.getTime())));
};

const caseTypes = ['民'];
const caseDetailTypes = ['初', '终', '撤终', '特终', '破终', '算终', '监', '再申', '再初', '再终'];

const getWritUseCS = (court, status) => {
    status = status === 'failed' ? 'wrong' : status;
    const id = getRandomNum(0, 10000).toString();

    const materialType = materialTypes.random();
    const time = getRandomDate(startDate, endDate);
    const caseType = caseTypes.random();
    const caseDetailType = caseDetailTypes.random();
    const num = getRandomNum(1, 10000);
    const length = getRandomNum(800, 2000);
    const title = court.courtName + materialType + '（' + time.getFullYear() + '）'
        + court.represent + caseType + caseDetailType + '字' + '第' + num + '号';
    return {id, title, time, length, status}
};

let courts = rawCourts || [];
const sliceStart = getRandomNum(0, courts.length - remainCourtNum + 1);
courts = courts.slice(sliceStart, sliceStart + remainCourtNum);

const reserveCourts = courts.splice(0, untestedWritNum);

let writs = [];
for (let i = 0; i < untestedWritNum; i++) {
    const court = reserveCourts[i];
    const status = 'untested';
    writs.push(getWritUseCS(court, status));
}

let areas = new Set();

courts.forEach(court => areas.add(court.area.slice(0, 2)));

areas = Array.from(areas);
areas.shuffle();

const getRandomTask = () => {
    const id = getRandomNum(0, 10000).toString();
    const area = areas.pop();
    let maxLength = getRandomNum(4, 12);
    let length = 0;
    const status = taskStatusList.random();
    const insideWrits = [];
    const expandNum = getRandomNum(1, 4);
    for (let i = 0; i < courts.length; i++) {
        const court = courts[i];
        if (length + expandNum > maxLength) {
            break;
        }
        if (court.area.slice(0, 2) === area) {
            for (let j = 0; j < expandNum; j++) {
                const writ = getWritUseCS(court, status);
                insideWrits.push(writ);
                writs.push(writ);
            }
            length += expandNum;
        }
    }
    if (length === 0) {
        return false;
    }
    const time = getRandomDate(startDate, endDate);
    const title = (area || '特殊') + '地区' + length + '篇裁判文书合集';
    return {id, title, time, length, status, insideWrits}
};

const tasks = [];

while (areas.length > 0) {
    const task = getRandomTask();
    if (task && writs.length + task.insideWrits.length > maxWritNum) {
        break;
    }
    task && tasks.push(task);
}


const fakeGetWrits = ({nameStr, startDate, endDate, taskId, writId} = {}) => {
    if (writId) {
        for (let writ of writs) {
            if (writId === writ.id) {
                return [writ];
            }
        }
    }
    if (taskId) {
        for (let task of tasks) {
            if (taskId === task.id) {
                return task.insideWrits;
            }
        }
    }
    let result = writs;
    let saver = [];
    if(nameStr){
        for (let writ of result){
            if(writ.title.indexOf(nameStr) !== -1){
                saver.push(writ);
            }
        }
        result = saver;
        saver = [];
    }
    if(startDate){
        for (let writ of result){
            if(writ.time > startDate.getTime()){
                saver.push(writ);
            }
        }
        result = saver;
        saver = [];
    }
    if(endDate){
        for (let writ of result){
            if(writ.time < endDate.getTime()){
                saver.push(writ);
            }
        }
        result = saver;
    }

    return result;
};


const fakeGetTasks = ({nameStr, startDate, endDate, taskId}) => {
    if (taskId) {
        for (let task of tasks) {
            if (taskId === task.id) {
                return [task];
            }
        }
    }
    let result = tasks;
    let saver = [];
    if(nameStr){
        for (let task of result){
            if(task.title.indexOf(nameStr)!==-1){
                saver.push(task);
            }
        }
        result = saver;
        saver = [];
    }
    if(startDate){
        for (let task of result){
            if(task.time > startDate.getTime()){
                saver.push(task);
            }
        }
        result = saver;
        saver = [];
    }
    if(endDate){
        for (let task of result){
            if(task.time < endDate.getTime()){
                saver.push(task);
            }
        }
        result = saver;
    }

    return result;
};

export {fakeGetWrits, fakeGetTasks}