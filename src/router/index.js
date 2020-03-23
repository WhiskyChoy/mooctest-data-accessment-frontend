import Vue from 'vue'
import VueRouter from 'vue-router'
import Resources from '@/views/Resources'
import WritOverall from '@/views/WritOverall'
import NotFound from '@/views/NotFound'
import TaskOverall from '@/views/TaskOverall'
import ConfigDefault from '@/views/ConfigDefault'
import Login from '@/views/Login'
import WritReport from '@/views/WritReport'
import TaskReport from '@/views/TaskReport'
import WritUpload from '@/views/WritUpload'
import Callback from '@/views/Callback'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {getLocalUser} from "@/utils/userUtil"
import {Notification} from 'element-ui'

Vue.use(VueRouter);

const callbackURL = '/auth/mooctest/callback';

const timeout = 2500;

const showInfo = (msg, title = '提示信息') => {
    Notification.info({
        title: title,
        message: msg,
        duration: timeout,
    });
};


const showWarning = (msg, title = '警告信息') => {
    Notification.warning({
        title: title,
        message: msg,
        duration: timeout,
    });
};

const routes = [
    {
        path: '*',
        component: NotFound
    },
    {
        path: '',
        redirect: '/resources'
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: callbackURL,
        name: 'callback',
        component: Callback,
        props: (route) => ({code: route.query.code})
    },
    {
        path: '/resources',
        // 有默认子路由，不要命名，去掉name属性
        component: Resources,
        meta: {requiresAuth: true},
        children: [
            {
                path: '',
                redirect: {name: 'writUpload'}
            },
            {
                path: 'writ-upload',
                name: 'writUpload',
                component: WritUpload,
            },
            {
                path: 'writ-overall',
                name: 'WritOverall',
                component: WritOverall
            },
            {
                path: 'task-overall',
                name: 'TaskOverall',
                component: TaskOverall
            },
            {
                path: 'config-default',
                name: 'ConfigDefault',
                component: ConfigDefault
            },
            {
                // 传值的时候，参数命名不能为writ-id，横杠要替换为下划线，否则识别不到。
                path: 'writ-report/:writ_id',
                name: 'WritReport',
                component: WritReport,
                props: true
            },
            {
                path: 'task-report/:task_id',
                name: 'TaskReport',
                component: TaskReport,
                props: true
            }

        ]
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});


NProgress.configure({
    easing: 'ease',  // 动画方式
    speed: 500,  // 递增进度条的速度
    showSpinner: false, // 是否显示加载ico
    trickleSpeed: 200, // 自动递增间隔
    minimum: 0.3 // 初始化时的最小百分比
});

//当路由进入前
router.beforeEach((to, from, next) => {
    const myNext = (...args) => {
        // 每次切换页面时，调用进度条
        NProgress.start();
        // next正常跳转
        next(...args);
    };

    const user = getLocalUser();
    if (to.path === '/login') {
        if (user) {
            showInfo('已登录，自动登入');
            myNext('/');
        } else {
            myNext();
        }
    } else if (to.path === callbackURL) {
        myNext();
    } else {
        // requireAuth:可以在路由元信息指定哪些页面需要登录权限
        if (to.matched.some(record => record.meta.requiresAuth) && user) {

            myNext();
        } else {
            showWarning('未登录，请重新登录');
            myNext('/login');
        }
    }


});
//当路由进入后：关闭进度条
router.afterEach(() => {
    // 在即将进入新的页面组件前，关闭掉进度条
    NProgress.done();
});

export {callbackURL}

export default router
