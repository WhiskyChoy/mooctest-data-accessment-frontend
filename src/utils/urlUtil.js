const getBaseURL = () => {
    const protocol = location.protocol;
    const host = location.host;
    const prefix = protocol + '//' + host;
    const mid = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : '';
    return prefix + mid;
};

export {getBaseURL}