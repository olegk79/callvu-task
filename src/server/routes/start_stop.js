const fs = require("fs");
const Promise = require('bluebird');
const express = require('express');
const router = express.Router();
const getUserIdByToken = require("../getUserIdByToken");
const INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR";

// start monitor
const Monitor = require("../monitor");
const monitor = new Monitor();
monitor.init();


/*a route for start / stop the monitoring service
*/
router.post('/api/start', (req, res, next) => {
    const json = {
        success: true
    };

    const token = req.headers.authorization; // get token from headers
    if (!token) {
        json.success = false;
        json.error = "session token not found";
        res.json(json);
    }
    const folder = req.body.folder;
    if (!folder) {
        json.success = false;
        json.error = "folder param not supplied";
        res.json(json);
    }
    
    getUserIdByToken(token)
        .then(getUserIdRes => {
            if (getUserIdRes.success === false) {
                json.success = false;
                json.error = `${INTERNAL_SERVER_ERROR} ::: ${getUserIdRes.error}`;
                res.json(json);
                return;
            }
            fs.mkdir(folder, (err) => { // create folder if doesn' exist
                monitor.startMonitor(getUserIdRes.userId, folder)
                    .then(startMonitorRes => {
                        if (startMonitorRes.success === false) {
                            json.success = false;
                            json.error = `${INTERNAL_SERVER_ERROR} ::: ${startMonitorRes.error}`;
                        }
                        res.json(json);
                    })
            }); 
            
        })
});

router.post('/api/stop', (req, res, next) => {
    const json = {
        success: true
    };

    const token = req.headers.authorization; // get token from headers
    if (!token) {
        json.success = false;
        json.error = "session token not found";
        res.json(json);
    }
    getUserIdByToken(token)
        .then(getUserIdRes => {
            if (getUserIdRes.success === false) {
                json.success = false;
                json.error = `${INTERNAL_SERVER_ERROR} ::: ${getUserIdRes.error}`;
                res.json(json);
                return;
            }
            monitor.stopMonitor(getUserIdRes.userId)
                .then(stopMonitorRes => {
                    if (stopMonitorRes.success === false) {
                        json.success = false;
                        json.error = `${INTERNAL_SERVER_ERROR} ::: ${stopMonitorRes.error}`;
                    }
                    res.json(json);
                })
        })   
});

module.exports = router;