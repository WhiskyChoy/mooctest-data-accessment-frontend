import http from '@/requests/http'
import {wait} from "@/utils/loadWaiter";
import {callbackURL} from "@/router";
import router from '@/router'
import qs from 'qs'
import {checkIfInnerAddress} from "@/utils/ipUtil";
import {getBaseURL} from "@/utils/urlUtil";

const getAuthCode = () => {
    const use_oauth = (process.env.VUE_APP_USE_OAUTH === "true")
    if (!checkIfInnerAddress(location.host) && use_oauth) {
        //注意是uri不是url
        const response_type = 'code';
        const redirect_uri = encodeURI(getBaseURL() + callbackURL);
        const scope = '';
        // const client_id = 'MooctestDataAssessment';
        const client_id = process.env.VUE_APP_OAUTH_CLIENT_ID;
        const query = qs.stringify({response_type, redirect_uri, scope, client_id});
        const oauthURL = process.env.VUE_APP_OAUTH_URL;
        if (!oauthURL) {
            return false;
        }
        window.location.href = oauthURL + '?' + query;
    } else {
        let code = process.env.VUE_APP_OAUTH_BYPASS_MATIC_CODE;
        code = code ? code : 'test';
        router.push(callbackURL + '?code=' + code);
    }
    return true;
};

const getUser = async (code) => {
    if (process.env.VUE_APP_AJAX_VERSION === 'v0') {
        //模拟等一会
        const {default:user} = await import('@/fake_data/js/user');
        await wait(1000);
        return user;
    }
    let URL;
    if (process.env.VUE_APP_AJAX_VERSION === 'v1') {
        URL = '/user/getUser'
    }
    if (process.env.VUE_APP_AJAX_VERSION === 'v2') {
        URL = '/user'
    }
    return http.get(URL, {params: {code}});
};

export {getAuthCode, getUser}