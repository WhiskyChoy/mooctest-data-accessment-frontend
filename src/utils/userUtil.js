const userKey = 'mooctest-civil-judicial-document-accessment-user';

const getLocalUser = () => {
    let user;
    try {
        user = JSON.parse(localStorage.getItem(userKey));
    } catch (e) {
        console.log(e);
        return null;
    }
    const now = new Date().getTime();
    const login = user && user.expires && user.expires > now;
    if (login) {
        return user;
    } else {
        logout();
        return null;
    }
};

const login = (userItem) => {
    localStorage.setItem(userKey, JSON.stringify(userItem));
};

const logout = () => {
    localStorage.removeItem(userKey);
};

export {userKey, getLocalUser, login, logout}