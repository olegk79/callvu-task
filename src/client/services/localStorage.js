const TOKEN = "token";
const STORAGE_NAME = "callvu_monitor";


export const storeData = (data) => {
    /*set the session token and user details on local storage*/
    window.localStorage.setItem(STORAGE_NAME,
        JSON.stringify({
            [TOKEN]:data.token
        }))
};

export const clearData = () => {
    window.localStorage.removeItem(STORAGE_NAME);
}

const getStorageProp = (prop) => {
    let data = getStorageData();
    if (data && data[prop]) {
        return data[prop];
    }
    return null;
}

const getStorageData = () => {
    let item = window.localStorage.getItem(STORAGE_NAME);
    if (item) {
        return JSON.parse(item);
    }
    return null;
}

export const getSessionToken = () => getStorageProp(TOKEN);