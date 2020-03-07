const baseURLs = {
    developmentURL: '',
    productionURL: ''
};

let baseURL = '';

if (process.env.NODE_ENV === 'development') {
    baseURL = baseURLs.developmentURL;
}
else if (process.env.NODE_ENV === 'production') {
    baseURL = baseURL.productionURL;
}

export default baseURL
