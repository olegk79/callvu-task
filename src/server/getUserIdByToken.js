/* 
determine user id by supplied token
*/
const SqliteAdapter = require("./sqlite");


module.exports = (token) => {
    let sqliteAdapter = new SqliteAdapter();

    const res = {
        success: true
    }

    return sqliteAdapter.determineUserIdBySuppliedToken(token)
        .then(getUserIdRes => {
            if (getUserIdRes.success === true) {
                res.userId = getUserIdRes.userId;
            } else {
                res.success = false;
                res.error = getUserIdRes.error;
            }
            return res;
        })
}
