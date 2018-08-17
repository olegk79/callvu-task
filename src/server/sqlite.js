const uuidv4 = require('uuid/v4');
const EVENTS = require("./events");

const sqlite3 = require('sqlite3').verbose(); 
const dbPath = "./src/server/callvu_monitor.db";
const bcrypt = require("bcrypt");
const tokensManager = require("./tokens-manager");

module.exports = class SqliteAdapter {

    constructor() {
        this._db = null;
    }

    // open / create DB
    _openCreateDb() {
        return new Promise((resolve) => {
            let db = new sqlite3.Database(dbPath,
                (err) => {
                    if (err) {
                        console.log("err", err);
                        resolve({
                            success: false,
                            error: err.message
                        });
                    }
                    //console.log("CONNECTED");
                    resolve({
                        success: true,
                        db
                    });
                });
        })
    }

    // execute SQL query and return results
    _executeQuery(db, sql) {
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) {
                    //db.close();
                    resolve({
                        success: false,
                        error: err.message
                    });
                }
                //db.close();
                resolve({
                    success: true,
                    rows
                });    
            });
        });
    }

    // check user credentials (username and password)
    // returns user token if OK
    handleUserLogin(username, password) {
        let res = {
            success: true, // true - no errors occured
            valid: false // true - username and password are correct
        };

        return this._openCreateDb() // connect
            .then(openDbRes => {
                if (openDbRes.success === false) {
                    res.success = false;
                    res.error = openDbRes.error;
                    return Promise.resolve(res);
                }
                // if DB opened successfully
                let db = openDbRes.db;
                // exec query
                return this._executeQuery(db, `select * from users where username like '${username}'`)
                    .then(execQRes => {
                        if (execQRes.success === false) { // some error in query
                            res.success = false;
                            res.error = execQRes.error;
                            db.close();
                            return Promise.resolve(res);
                        }
                        // query succeeded
                        let rows = execQRes.rows;

                        if (rows.length === 0) { // if user with given username was not found
                            return Promise.resolve(res);
                        }
                        let userId = rows[0].id;
                        // check supplied password vs hash from db
                        return this._checkPassword(password, rows[0].password)
                            .then(isValid => {
                                res.valid = isValid; // true - match, false - mismatch
                                if (isValid === false) { // no match..? no token!
                                    return Promise.resolve(res);
                                }
                                // user logged in successfully? lets generate token
                                let token = tokensManager.generateToken();
                                // store the token in DB
                                return this._executeQuery(db, `update users set token='${token}' where id=${userId}`)
                                    .then(storeTokenRes => {
                                        db.close(); // finished with DB
                                        if (storeTokenRes.success === true) {
                                            res.token = token;
                                        } else { // some error in query
                                            res.success = false;
                                            res.error = storeTokenRes.error;
                                        }                                      
                                        return Promise.resolve(res);
                                    })
                            });
                    })
            })
            .catch(e => { // unhandled exceptions handler
                res.success = false;
                res.error = e.message;
                return Promise.resolve(res);
            });
    }

    // get given user monitoring info
    getUserMonitoringInfo(userId) {
        let res = {
            success: true // true - no errors occured
        };

        return this._openCreateDb() // connect
            .then(openDbRes => {
                if (openDbRes.success === false) {
                    res.success = false;
                    res.error = openDbRes.error;
                    return Promise.resolve(res);
                }
                // if DB opened successfully
                let db = openDbRes.db;
                // exec query
                return this._executeQuery(db, `select * from monitor_folders where user_id=${userId}`)
                    .then(execQRes => {
                        db.close();
                        if (execQRes.success === true) { // query succeeded
                            res.rows = execQRes.rows;
                        } else { // some error in query
                            res.success = false;
                            res.error = execQRes.error;
                        }
                        return Promise.resolve(res);
                    })
            })
            .catch(e => { // unhandled exceptions handler
                res.success = false;
                res.error = e.message;
                return Promise.resolve(res);
            });
    }

    // get monitoring info for users (need this at system start to know if there are users currently subscribed for monitor)
    getUsersMonitoringInfo() {
        let res = {
            success: true // true - no errors occured
        };

        return this._openCreateDb() // connect
            .then(openDbRes => {
                if (openDbRes.success === false) {
                    res.success = false;
                    res.error = openDbRes.error;
                    return Promise.resolve(res);
                }
                // if DB opened successfully
                let db = openDbRes.db;
                // exec query
                return this._executeQuery(db, `select * from monitor_folders`)
                    .then(execQRes => {
                        db.close();
                        if (execQRes.success === true) { // query succeeded
                            res.rows = execQRes.rows; 
                        } else { // some error in query
                            res.success = false;
                            res.error = execQRes.error;
                        }                           
                        return Promise.resolve(res);
                    })
            })
            .catch(e => { // unhandled exceptions handler
                res.success = false;
                res.error = e.message;
                return Promise.resolve(res);
            });
    }

    // determine to which user belongs the supplied token (need this for all inbound api calls except login)
    determineUserIdBySuppliedToken(token) {
        let res = {
            success: true // true - no errors occured
        };

        return this._openCreateDb() // connect
            .then(openDbRes => {
                if (openDbRes.success === false) {
                    res.success = false;
                    res.error = openDbRes.error;
                    return Promise.resolve(res);
                }
                // if DB opened successfully
                let db = openDbRes.db;
                // exec query - search for the token in DB
                return this._executeQuery(db, `select id from users where token like '${token}'`)
                    .then(execQRes => {
                        db.close();
                        if (execQRes.success === true) {
                            // query succeeded
                            let rows = execQRes.rows;
                            if (rows.length > 0) { // user found
                                res.userId = rows[0].id;
                            } else { // if user with given token was not found
                                res.success = false;
                                res.error = "invalid token supplied";
                            }
                        } else { // some error in query
                            res.success = false;
                            res.error = execQRes.error;
                        }                
                        return Promise.resolve(res);
                    })
            })
            .catch(e => { // unhandled exceptions handler
                res.success = false;
                res.error = e.message;
                return Promise.resolve(res);
            });
    }

    // handle user logout (clear token)
    handleUserLogout(userId) {
        let res = {
            success: true // true - no errors occured     
        };
        return this._openCreateDb() // connect
            .then(openDbRes => {
                if (openDbRes.success === false) {
                    res.success = false;
                    res.error = openDbRes.error;
                    return Promise.resolve(res);
                }
                // if DB opened successfully
                let db = openDbRes.db;

                // exec query
                return this._executeQuery(db, `update users set token=null where id=${userId}`)
                    .then(clearTokenRes => {
                        db.close(); // finished with DB
                        if (clearTokenRes.success === false) { // some error in query
                            res.success = false;
                            res.error = clearTokenRes.error;
                        } 
                        return Promise.resolve(res);
                    })

            })
            .catch(e => { // unhandled exceptions handler
                res.success = false;
                res.error = e.message;
                return Promise.resolve(res);
            });

    }

    // stop monitor folder for given user id
    stopMonitorFolder(userId) {
        let res = {
            success: true // true - no errors occured        
        };
        return this._openCreateDb() // connect
            .then(openDbRes => {
                if (openDbRes.success === false) { // failed to open db
                    res.success = false;
                    res.error = openDbRes.error;
                    return Promise.resolve(res);
                }
                // if DB opened successfully
                let db = openDbRes.db;
                // exec first query - delete row from monitor_folders
                return this._executeQuery(db, `delete from monitor_folders where user_id=${userId}`)
                    .then(execQRes1 => {
                        if (execQRes1.success === false) { // some error in query # 1
                            res.success = false;
                            res.error = execQRes1.error;
                            db.close();
                            return Promise.resolve(res);
                        }
                        // exec second query - clean user logs
                        return this._executeQuery(db, `delete from log where user_id=${userId}`)
                            .then(execQRes2 => {
                                if (execQRes2.success === false) { // some error in query # 2
                                    res.success = false;
                                    res.error = execQRes2.error;
                                }
                                // anyway we finished here...
                                db.close();
                                return Promise.resolve(res);
                            }) // end of Q 2
                    }) // end of Q 1
            }) // end of open db
            .catch(e => { // unhandled errors
                res.success = false;
                res.error = e.message;
                return Promise.resolve(res);
            });
    }

    // start monitor given folder for given user id
    startMonitorFolder(userId, folder) {
        let res = {
            success: true // true - no errors occured       
        };
        return this._openCreateDb() // connect
            .then(openDbRes => {
                if (openDbRes.success === false) { // failed to open db
                    res.success = false;
                    res.error = openDbRes.error;
                    return Promise.resolve(res);
                }
                // if DB opened successfully
                let db = openDbRes.db;
                // exec query - insert / replace folder column value for user
                return this._executeQuery(db, `insert or replace into monitor_folders values ('${userId}','${folder}')`)
                    .then(execQRes => {
                        if (execQRes.success === false) { // some error in query
                            res.success = false;
                            res.error = execQRes.error;
                        }
                        db.close();
                        return Promise.resolve(res); // anyway we finished here...
                    }) // end of Q 
            }) // end of open db
            .catch(e => { // unhandled errors
                res.success = false;
                res.error = e.message;
                return Promise.resolve(res);
            });
    }

    // fetch list of events for given user and starting from given timestamp (later than...)
    fetchEventsList(userId, startFromTs = 0) {
        let res = {
            success: true // true - no errors occured
        };

        return this._openCreateDb()
            .then(openDbRes => {
                if (openDbRes.success === false) { // failed to open db
                    res.success = false;
                    res.error = openDbRes.error;
                    return Promise.resolve(res);
                }
                // if DB opened successfully
                let db = openDbRes.db;

                

                // exec query
                return this._executeQuery(db, `select uid,timestamp,event_id,filename from log where user_id=${userId} and timestamp>${startFromTs} order by timestamp`)
                    .then(execQRes => {
                        db.close();
                        if (execQRes.success === false) { // some error in query
                            res.success = false;
                            res.error = execQRes.error;
                        } else {
                            res.eventsList = execQRes.rows;                        
                        }
                        
                        return Promise.resolve(res); // anyway we finished here...
                    })

            })
            .catch(e => { // unhandled errors
                res.success = false;
                res.error = e.message;
                return Promise.resolve(res);
            });
    }

    // write event log to db
    writeEventToDb(event) {
        const { timestamp, user_id, event_id, filename } = event;


        let res = {
            success: true // true - no errors occured
        };

        return this._openCreateDb()
            .then(openDbRes => {
                if (openDbRes.success === false) { // failed to open db
                    res.success = false;
                    res.error = openDbRes.error;
                    return Promise.resolve(res);
                }
                // if DB opened successfully
                let db = openDbRes.db;

                // generate guid for event
                let uid = uuidv4();

                // exec query
                return this._executeQuery(db, `insert into log(uid,timestamp,user_id,event_id,filename) values ('${uid}', '${timestamp}', '${user_id}', '${event_id}', '${filename}')`)
                    .then(execQRes => {
                        if (execQRes.success === false) { // some error in query
                            res.success = false;
                            res.error = execQRes.error;
                        }
                        db.close();
                        return Promise.resolve(res); // anyway we finished here...
                    })

            })
            .catch(e => { // unhandled errors
                res.success = false;
                res.error = e.message;
                return Promise.resolve(res);
            });
    }

    // check if entered password is correct using hash taken from DB 
    _checkPassword(password, hash) {
        return bcrypt.compare(password, hash);
    }
}