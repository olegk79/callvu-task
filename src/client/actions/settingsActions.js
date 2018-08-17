import stopMonitorSvc from "../services/stop";
import startMonitorSvc from "../services/start";
import logoutSvc from "../services/logout";

const SETTINGS_ACTIONS = {
    STOP_MONITOR: "STOP_MONITOR",
    MONITOR_STOPPED: "MONITOR_STOPPED",
    START_MONITOR: "START_MONITOR",
    MONITOR_STARTED: "MONITOR_STARTED",
    LOGOUT: "LOGOUT",
    LOGGED_OUT:"LOGGED_OUT"
}

export const stopMonitor = () => ({
    type: SETTINGS_ACTIONS.STOP_MONITOR
});

export const startMonitor = () => ({
    type: SETTINGS_ACTIONS.START_MONITOR
});

export const logout = () => ({
    type: SETTINGS_ACTIONS.LOGOUT
});

export const loggedOut = () => ({
    type: SETTINGS_ACTIONS.LOGGED_OUT
});

export const handleLogout = (token) => {
    return (dispatch) => {
        dispatch(logout());
        return logoutSvc(token)
            .then(data => {
                if (data.success) {
                    dispatch(loggedOut());
                }
            })
    }
}

export const handleStopMonitor = (token) => {
    return (dispatch) => {
        dispatch(stopMonitor());
        return stopMonitorSvc(token)
            .then(data => {
                if (data.success) {
                    dispatch(monitorStopped());
                }
            })
    }
};

export const handleStartMonitor = (token, folder) => {
    return (dispatch) => {
        dispatch(startMonitor());
        return startMonitorSvc(token, folder)
            .then(data => {
                if (data.success) {
                    dispatch(monitorStarted(folder));
                }
            });
    }
}


export const monitorStopped = () => ({
    type: SETTINGS_ACTIONS.MONITOR_STOPPED
});

export const monitorStarted = (folder) => ({
    type: SETTINGS_ACTIONS.MONITOR_STARTED,
    folder
})

export default SETTINGS_ACTIONS;