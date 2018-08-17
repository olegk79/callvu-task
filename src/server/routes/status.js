const Promise = require('bluebird');
const express = require("express");
const router = express.Router();
const SqliteAdapter = require("../sqlite");
const getUserIdByToken = require("../getUserIdByToken");
const INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR";
/*
route for fetching status - returns list of events happened since last poll (if param "ts" supplied)
token is passed as identifier of user to which the data belongs
*/
router.get("/api/status", (req, res) => {
    //let start = Date.now();
    const json = {
        success: true
    };
    const { ts } = req.query; // get "last event timestamp as known by client" passed as param (we will return DELTA of events, not all)
    //if (!ts) ts = 0; // if ts not supplied - return all events
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
            let sqliteAdapter = new SqliteAdapter();

            sqliteAdapter.fetchEventsList(getUserIdRes.userId, ts)
                .then(eventsListRes => {
                    if (eventsListRes.success === false) {
                        json.success = false;
                        json.error = `${INTERNAL_SERVER_ERROR} ::: ${eventsListRes.error}`;
                        res.json(json);
                        return;
                    }
                    json.events = eventsListRes.eventsList;
                    if (ts > 0) { // if we are taking delta (not firs api request) - finished here
                        //let end = Date.now();
                        //console.log("passed: ", end - start);
                        res.json(json);
                        //console.log(json.events);
                        return;
                    }

                    //************
                    //json.success = false;
                    //json.error = "ERROR TEST";
                    //res.json(json);
                    //return;
                    //***********

                    // if ts = 0 (initial fetch request from client - we need to get info: is currently monitor on for the user? and if so - which folder is monitored?
                    sqliteAdapter.getUserMonitoringInfo(getUserIdRes.userId)
                        .then(userInfoRes => {
                            if (userInfoRes.success === true) {
                                if (userInfoRes.rows.length === 1) { // if monitor is working for the user
                                    json.monitoring = true;
                                    json.folderMonitored = userInfoRes.rows[0].folder;

                                } else {
                                    json.monitoring = false;
                                }
                            } else {
                                json.success = false;
                                json.error = `${INTERNAL_SERVER_ERROR} ::: ${userInfoRes.error}`;
                            }
                            res.json(json);
                        });
                    
                });
        });  
});

module.exports = router;
