const chokidar = require("chokidar");
const sqliteAdapter = require("./sqlite");
const EVENTS = require("./events");
const FILE_ADDED_EVENT = "add";
const FILE_REMOVED_EVENT = "unlink";
//**************************************
// there is no such event as "rename"
// if file is renamed, node fires 2 events: "add" and (in 100ms after that) "unlink"
// it is impossible (?) to detect file rename unless implement some timers / checks etc.
// and even in that case it will be non deterministic (for example, when multiple processes adding / removing files simultaneously into the folder )
//********************************

module.exports = class FolderWatcher {

    constructor(userId, path) {
        this._userId = userId;
        this._path = path;
        this._adapter = new sqliteAdapter();
        this._watcher = null;
    }

    startMonitor() {
        console.log(`starting watcher for user # ${this._userId}`);
        // Initialize watcher.
        this._watcher = chokidar.watch(this._path, {
            persistent: true,
            ignoreInitial: true
        });

        // Add event listeners.
        this._watcher
            .on(FILE_ADDED_EVENT, path => {
                console.log(`${Date.now()}: user # ${this._userId} - File '${path}' has been added`);
                this._writeEventToDb(FILE_ADDED_EVENT, this._getFileName(path));
            })
            .on(FILE_REMOVED_EVENT, path => {
                console.log(`${Date.now()}: user # ${this._userId} - File '${path}' has been removed`);
                this._writeEventToDb(FILE_REMOVED_EVENT, this._getFileName(path));
            });
    }

    stopMonitor() {
        if (this._watcher) {
            console.log(`stopping watcher for user # ${this._userId}`);
            this._watcher.close();
            this._watcher = null;
        }
        
    }

    _getFileName(path) {
        let pathSplit = path.split("\\");
        return pathSplit[pathSplit.length - 1];
    }

    _writeEventToDb(event, filename) {
        let eventId;
        switch (event) {
            case FILE_ADDED_EVENT:
                eventId = EVENTS.FILE_ADDED;
                break;
            case FILE_REMOVED_EVENT:
                eventId = EVENTS.FILE_REMOVED;
                break;
            default:
                throw new Error("unrecognized event: " + event);

        }

        this._adapter.writeEventToDb({
            timestamp: Date.now(),
            user_id: this._userId,
            event_id: eventId,
            filename
        });
    }

}