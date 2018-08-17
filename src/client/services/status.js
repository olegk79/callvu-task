/*getting status (list of events) from server*/
import axios from "axios";
export default (token, ts) => {
    let url = ts ? `/api/status?ts=${ts}` :"/api/status"

    return axios({
        method: "GET",
        url,
        json: true,
        headers: { Authorization: token }
    }).then(result => result.data);
};