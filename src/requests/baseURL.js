const baseURLs = {
    v1URL: '',
    v2: '',
    debugURL: ''
};

let baseURL = '';

if (process.env.NODE_ENV === 'v1') {
    baseURL = baseURLs.v1URL;
}
if (process.env.NODE_ENV === 'v2') {
    baseURL = baseURL.v2;
}
if (process.env.NODE_ENV === 'debug') {
    baseURL = baseURL.debugURL
}


export default baseURL
