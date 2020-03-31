import axios from 'axios'
import qs from 'qs'
import {Notification} from 'element-ui'
import router from '@/router'
import {getLocalUser, logout} from "@/utils/userUtil";

const timeout = 2500;

/**
 * 参考了https://juejin.im/post/5b55c118f265da0f6f1aa354
 */

/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 * @param {String} msg 错误提示信息
 * @param {String} title 标题，默认为错误提示
 */
const showError = (msg, title = '错误提示') => {
    Notification.error({
        title: title,
        message: msg,
        duration: timeout,
    });
};

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
    router.replace({
        path: '/login',
        query: {
            redirect: router.currentRoute.fullPath
        }
    });
};

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 * @param {String} payloadMsg 服务器的负载描述信息
 */
const errorHandle = (status, payloadMsg) => {
    // 状态码判断
    switch (status) {
        // 正常时不应该调用此方法，直接返回
        case 200:
            break;
        // 401: 未登录状态，跳转登录页，此时发送的信息没有token
        case 401:
            toLogin();
            break;
        // 403 token过期
        // 清除token并跳转登录页
        case 403:
            showError('登录过期，请重新登录');
            logout();
            // 装载VUEX后再处理
            // store.commit('loginSuccess', null);
            toLogin();
            break;
        // 404请求不存在
        case 404:
            showError('请求的资源不存在');
            break;
        case 500:
            showError('服务器错误');
            break;
        // 其他错误，显示payload
        default:
            showError(payloadMsg, '其他错误，错误码：' + status)
    }
};

const baseURL = process.env.VUE_APP_AJAX_BASE_URL ? process.env.VUE_APP_AJAX_BASE_URL : '';

const instance = axios.create({baseURL});


/**
 * 请求拦截器
 * 每次请求前，检查localStorage,如存在token则在请求头中携带token
 */
instance.interceptors.request.use(
    config => {
        // 虽然没用到，但还是给它配置了
        if (config.method === 'post' && config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
            config.data = qs.stringify(config.data);
        }
        // 本来是在state中拿的
        // const token = store.state.token;
        const user = getLocalUser();
        const token = user && user.selfToken ? user.selfToken : null;
        // 大写tokenType首字母
        const tokenType = user && user.tokenType ? user.tokenType[0].toUpperCase() + user.tokenType.slice(1) : null;
        token && tokenType && (config.headers.Authorization = tokenType + ' ' + token);
        return config;
    },
    error => Promise.error(error));

// 响应拦截器
instance.interceptors.response.use(
    // 请求成功，送出数据（这里如果写Promise.resolve(response)是一样的，会原样返回Promise）
    response => response.data,
    // 请求失败
    error => {
        const {response} = error;
        if (response) {
            // 请求已发出，但是不在2xx的范围
            errorHandle(response.status, response.data.message);
            //这里处理过后就不再往后丢reject了，下同，最后如果axios调了Promise.reject(error)则返回的是undefined
            // return Promise.reject(response);
        } else {
            // 处理断网的情况
            // eg:请求超时或断网时，更新state的network状态
            // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
            // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
            if (!window.navigator.onLine) {
                showError('已断网，请检查网络连接');
                // store.commit('changeNetwork', false);
                // return Promise.reject(error);
            } else {
                showError('未知错误');
                // return Promise.reject(error);
            }
        }
    });

export default instance
