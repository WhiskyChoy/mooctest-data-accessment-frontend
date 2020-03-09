const metrics = [
    '度量指标1','度量指标2'
];

const pzwzx = [
    {
        header: '文首',
        //得分 0 1 2中的1个
        score: 2
    }
];

const xxsm = [
    {
        content: 'a段落内容',
        advice: ['第一条修改意见', '第二条修改意见']
    }

];

const xzx = [
    {
        metric: '参数人信息细致性',
        //第一项为得分，第二项为总分
        score: 7,
        total: 20
    }
];

const ycx = [
    {
        metric: '参数人信息细致性',
        //第一项为得分，第二项为总分
        score: 7,
        total: 20,
        //false就不看了，显示未获取时间
        valid: false
    }
];

const rader = [
    {
        metric: '细致性',
        score: 7,
        total: 10
    }
];
// 重构检测，界面显示为抄袭检测
const cgjx = {
  score: 5,
  total: 10,
  conclusion: '这句和那句可能是抄袭来的'
};
// 语言风格
const yyfg = [
    {
        sentence: '一个句子，包含结束标点。',
        // 不超过1
        delta: 0.7
    }
];


//情感分类，界面显示为客观程度
const qgfl = [
    {
        sentence: '一个句子，包含结束标点。',
        // 不超过1
        delta: 0.5
    }
];

const xsal = [
  '第一条法条',
  '第二条法条'
];

//-------------------------------------------------------

const mpzwzx = [
    {
        header: '文首',
        //得分 0 1 2中的1个
        score: 2
    }
];

const multi_metrics = [
    '度量指标1','度量指标2'
];

const area_distribution = {
    city: ['北京', '上海', '重庆', '天津', '辽宁', '江苏', '浙江', '山东', '吉林', '黑龙江', '河北', '广州'],
    data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162, 32.6, 20.0, 6.4, 3.3]
};

const time_distribution = {
    year: [ '2015年', '2016年', '2017年', '2018年', '2019年', '2020年'],
    data: [135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
};


const multi_radar = {
    indicator: [
        { text: 'IE8-', max: 400},
        { text: 'IE9+', max: 400},
        { text: 'Safari', max: 400},
        { text: 'Firefox', max: 400},
        { text: 'Chrome', max: 400}
    ],

    radar_multiple :[

        {
            value: [0, 2, 4, 8, 3],
            name: '2013年的情况'
        }
    ]

};

const vs_standard = {
    x_axis:['细致性', '一致性', '延迟性', '真实性', '完整性', '易读性','准确性'],
    test_name:'待测数据集指标均分',
    standard_name: '标准数据集指标均分',
    test_value:[4.8, 2.9, 3.0, 2.5, 4.6, 4.3, 2.2],
    standard_value:[4.6, 3.7, 4.0, 4.4, 4.5, 4.7,4.0]
};