/*logging out*/
import axios from "axios";
export default (token) => {
    return axios({
        method: "POST",
        url: "/api/logout",
        json: true,
        headers: { Authorization: token }
    }).then(result => result.data);
};