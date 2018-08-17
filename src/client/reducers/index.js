import { combineReducers } from "redux";

//reducers
import eventsManagement from "./events-list";
import settingsManagement from "./settings";

//reducer selectors
import * as fromEventsList from "./events-list";
import * as fromSettings from "./settings";

const rootReducer = combineReducers({
    eventsManagement,
    settingsManagement
});

export default rootReducer;

///////////////////////////////////SELECTORS/////////////////////////////////////////////////////////////
export const getEventsList = state => fromEventsList.getEventsList(state.eventsManagement);
export const getEventsInitialListIsLoading = state => fromEventsList.getInitialListIsLoading(state.eventsManagement);
export const getInitialListFetchErrorMessage = state => fromEventsList.getInitialListFetchErrorMessage(state.eventsManagement);

export const getUserMonitoringInfo = state => fromSettings.getUserMonitoringInfo(state.settingsManagement);
export const getMonitorStatusIsUpdating = state => fromSettings.getIsUpdating(state.settingsManagement);
export const getMonitorIsLoggingOut = state => fromSettings.getIsLoggingOut(state.settingsManagement);

///////////////////////////////////SELECTORS/////////////////////////////////////////////////////////////
