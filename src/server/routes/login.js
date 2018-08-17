const Promise = require('bluebird');
const express = require('express');
const router = express.Router();
const SqliteAdapter = require("../sqlite");
const INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR";
/*a route for login - receives username and password in json format
checks the credentials and generates a token if valid
*/
router.post('/api/login', (req, res, next) => {
    const json = {
        success: true
    };
    if (!req.body.username || !req.body.password) {
        json.success = false;
        json.error = "username and password are needed";
        res.json(json);
        return;
    }

    return new SqliteAdapter().handleUserLogin(req.body.username, req.body.password)
        .then(result => {
            if (result.success === true) {
                if (result.valid === true) { // valid
                    json.data = { token: result.token };
                } else { // invalid user/ pass
                    json.success = false;
                    json.error = "Invalid username/password";
                }
            } else {
                json.success = false;
                json.error = `${INTERNAL_SERVER_ERROR} ::: ${result.error}`;
            }
            res.json(json);
        }) 
});



module.exports = router;