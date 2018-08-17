/*signing in to the app with the login credentials from the Login page*/
import axios from "axios";
export default (username, password) => {
    return axios({
        method: "POST",
        url: "/api/login",
        json: true,
        data: {
            username,
            password
        }
    }).then(result => result.data);
};