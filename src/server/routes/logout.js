const Promise = require('bluebird');
const express = require('express');
const router = express.Router();
const SqliteAdapter = require("../sqlite");
const getUserIdByToken = require("../getUserIdByToken");
const INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR";
/*a route for logout
*/
router.post('/api/logout', (req, res, next) => {
    const json = {
        success: true
    };

    const token = req.headers.authorization; // get token from headers
    if (!token) {
        json.success = false;
        json.error = "session token not found";
        res.json(json);
        return;
    }

    getUserIdByToken(token)
        .then(getUserIdRes => {
            if (getUserIdRes.success === false) {
                json.success = false;
                json.error = `${INTERNAL_SERVER_ERROR} ::: ${getUserIdRes.error}`;
                res.json(json);
                return;
            }
            new SqliteAdapter().handleUserLogout(getUserIdRes.userId)
                .then(logoutRes => {
                    if (logoutRes.success === false) {
                        json.success = false;
                        json.error = logoutRes.error;
                    }
                });
            res.json(json);
        });
});



module.exports = router;