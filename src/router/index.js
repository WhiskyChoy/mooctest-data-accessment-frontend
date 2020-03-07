import Vue from 'vue'
import VueRouter from 'vue-router'
import Resources from '@/views/Resources'
import WritOverall from '@/views/WritOverall'
import NotFound from '@/views/NotFound'
import TaskOverall from '@/views/TaskOverall'
import ConfigDefault from '@/views/ConfigDefault'
import Login from '@/views/Login'

Vue.use(VueRouter);

const routes = [
    {
        path: '*',
        component: NotFound
    },
    {
        path: '/resources',
        name: 'Resources',
        component: Resources,
        children: [
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
