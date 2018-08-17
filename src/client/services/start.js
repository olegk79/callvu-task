/*getting status (list of events) from server*/
import axios from "axios";
export default (token, folder) => {

    return axios({
        method: "POST",
        url: "/api/start",
        data: { folder },
        json: true,
        headers: { Authorization: token }
    }).then(result => result.data);
};