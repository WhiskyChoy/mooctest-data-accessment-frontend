const startDate = new Date(2010, 0, 24, 11, 33, 0);
const endDate = new Date();
const startNum = 1;
const endNum = 100000;

const writListStatus = ['untested', 'waiting', 'ongoing', 'finished', 'wrong', 'accident'];
const taskListStatus = ['waiting', 'ongoing', 'finished', 'failed'];

const courts = [
    {
        area: '',
        represent: ''
    },
];

const materialType = ['民事判决书', '民事调解书', '民事裁定书'];

const getRandomDate = () => {
    return new Date(startDate.getTime() + Math.floor(Math.random() * (endDate.getTime() - startDate.getTime())));
};

const caseType = [];

const getRandomNum = () => {
    return Math.floor(startNum + (endNum - startNum) * Math.random());
};

const getWirt = ()=>{

};

let writs = [];

