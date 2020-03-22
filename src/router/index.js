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

Vue.use(VueRouter);

const routes = [
    {
        path: '*',
        component: NotFound
    },
    {
        path: '/resources',
        // 有默认子路由，不要命名，去掉name属性
        component: Resources,
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
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router
