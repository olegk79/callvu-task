const FolderWatcher = require("./folderWatcher");
const SqliteAdapter = require("./sqlite");


// class which used to manage all the monitoring (manages monitoring for all the users)
module.exports = class Monitor {
    constructor() {
        this._watchers = {}; // this is the dictionary of user id -> monitor (watcher) for the user
        this._dbAdapter = new SqliteAdapter();
    }

    // this is called in order to initialize the monitor on server start
    // should goto db and check if there are existing monitor subscriptions for users
    init() {
        return this._dbAdapter.getUsersMonitoringInfo()
            .then(result => {
                if (result.success === true) {
                    for (let row of result.rows) { // run over rows (= users subscriptions to monitoring)
                        this._watchers[row.user_id] = new FolderWatcher(row.user_id, row.folder);
                        console.log(`start monitor folder ${row.folder} for user # ${row.user_id}`);
                        this._watchers[row.user_id].startMonitor();
                    }

                } else {
                    throw new Error(result.error);
                }
            })
    }

    // instruct to stop monitoring for given user
    stopMonitor(userId) {
        console.log(`stop monitor for user # ${userId}`);
        let watcher = this._watchers[userId];
        if (watcher) { // ensure that there is watcher for user running
            // instruct watcher to stop
            this._watchers[userId].stopMonitor();
            // remove from watchers dict.
            delete this._watchers[userId];
        }
        // update in db also
        return this._dbAdapter.stopMonitorFolder(userId);
    }

    // instruct to start monitoring given path for given user
    startMonitor(userId, path) {
        console.log(`start monitor folder ${path} for user # ${userId}`);
        let watcher = this._watchers[userId];
        if (watcher) { // check if watcher already running, in this case stop it and run new one
            watcher.stopMonitor();
        }
        watcher = new FolderWatcher(userId, path);
        this._watchers[userId] = watcher;
        watcher.startMonitor();
        // update in db also
        return this._dbAdapter.startMonitorFolder(userId, path);
    }

}