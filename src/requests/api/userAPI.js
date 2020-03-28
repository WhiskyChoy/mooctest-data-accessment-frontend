import http from '@/requests/http'
import {wait} from "@/utils/loadWaiter";
import user from "@/fake_data/js/user";
import {callbackURL} from "@/router";
import router from '@/router'
import qs from 'qs'
import {checkIfInnerAddress} from "@/utils/ipUtil";
import {getBaseURL} from "@/utils/urlUtil";

const getAuthCode = () => {
    if (!checkIfInnerAddress(location.host)) {
        //注意是uri不是url
        const redirect_uri = encodeURI(getBaseURL() + callbackURL);
        const scope = '';
        const client_id = 'MooctestDataAssessment';
        const query = qs.stringify({response_type, redirect_uri, scope, client_id});
        const oauthURL = process.env.VUE_APP_OAUTH_URL;
        if (!oauthURL) {
            return false;
        }
        window.location.href = oauthURL + '?' + query;
    } else {
        router.push(callbackURL + '?code=test');
    }
};

const getUser = async (code) => {
    if (process.env.VUE_APP_AJAX_VERSION === 'v0') {
        //模拟等一会
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