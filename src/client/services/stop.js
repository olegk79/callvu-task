/*getting status (list of events) from server*/
import axios from "axios";
export default (token) => {

    return axios({
        method: "POST",
        url:"/api/stop",
        json: true,
        headers: { Authorization: token }
    }).then(result => result.data);
};