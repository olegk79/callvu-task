import SETTINGS_ACTIONS from "../actions/settingsActions";
import EVENTS_LIST_ACTIONS from "../actions/eventsListActions";
import { combineReducers } from "redux";

const isLoggingOut = (state = false, action) => {
    switch (action.type) {
        case SETTINGS_ACTIONS.LOGOUT:
            return true;
        case SETTINGS_ACTIONS.LOGGED_OUT:
            return false;
        default:
            return state;
    }
}


const isUpdating = (state = false, action) => {
    switch (action.type) {
        case SETTINGS_ACTIONS.START_MONITOR:
            return true;
        case SETTINGS_ACTIONS.STOP_MONITOR:
            return true;
        case SETTINGS_ACTIONS.MONITOR_STARTED:
            return false;
        case SETTINGS_ACTIONS.MONITOR_STOPPED:
            return false;
        default:
            return state;
    }
}

const userMonitoringInfo = (state = {}, action) => {
    switch (action.type) {
        case EVENTS_LIST_ACTIONS.INITIAL_EVENTS_LIST_FETCHED:
            const { monitoring, folderMonitored } = action.data;
            return { monitoring, folderMonitored };
        case SETTINGS_ACTIONS.MONITOR_STARTED:
            return {
                monitoring: true,
                folderMonitored: action.folder
            };
        case SETTINGS_ACTIONS.MONITOR_STOPPED:
            return {
                monitoring: false,
                folderMonitored: null
            };
        case EVENTS_LIST_ACTIONS.CLEAR_EVENTS_LIST:
            return {};
        default:
            return state;
    }

} 

const settingsManagement = combineReducers({
    isUpdating,
    userMonitoringInfo,
    isLoggingOut
});

export default settingsManagement;

///////////////SELECTORS//////////////////////////
export const getIsUpdating = state => state.isUpdating;
export const getUserMonitoringInfo = state => state.userMonitoringInfo;
export const getIsLoggingOut = state => state.isLoggingOut;