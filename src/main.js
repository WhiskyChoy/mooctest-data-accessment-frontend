import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
    easing: 'ease',  // 动画方式
    speed: 500,  // 递增进度条的速度
    showSpinner: false, // 是否显示加载ico
    trickleSpeed: 200, // 自动递增间隔
    minimum: 0.3 // 初始化时的最小百分比
});

//当路由进入前
router.beforeEach((to, from , next) => {
    // 每次切换页面时，调用进度条
    NProgress.start();
    // next正常跳转
    next();
});
//当路由进入后：关闭进度条
router.afterEach(() => {
    // 在即将进入新的页面组件前，关闭掉进度条
    NProgress.done()
});

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
