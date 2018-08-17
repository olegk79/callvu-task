import EVENTS_LIST_ACTIONS from "../actions/eventsListActions";
import { combineReducers } from "redux";

const events = (state = [], action) => {
    switch (action.type) {
        case EVENTS_LIST_ACTIONS.INITIAL_EVENTS_LIST_FETCHED:
            //console.log("INITIAL_EVENTS_LIST_FETCHED", action);
            return action.data.events;
        case EVENTS_LIST_ACTIONS.INITIAL_EVENTS_FETCH_FAILED:
            return [];
        case EVENTS_LIST_ACTIONS.EVENTS_LIST_DELTA_FETCHED:
            //console.log("EVENTS_LIST_DELTA_FETCHED",action);
            //console.log("prev", state.length);
            let newState = state.slice();
            for (let event of action.data.events) {
                //console.log(event);
                let ev = state.find(e => e.uid === event.uid);
                if (!ev) {
                    newState.push(event);
                }
            }
            return newState;
        case EVENTS_LIST_ACTIONS.CLEAR_EVENTS_LIST:
            return [];
        default:
            return state;
    }
}

const initialFetchErrorMessage = (state = "", action) => {
    switch (action.type) {
        case EVENTS_LIST_ACTIONS.FETCH_EVENTS_LIST_INIT:
            return "";
        case EVENTS_LIST_ACTIONS.INITIAL_EVENTS_LIST_FETCHED:
            return "";
        case EVENTS_LIST_ACTIONS.INITIAL_EVENTS_FETCH_FAILED:
            return action.data.error;
        case EVENTS_LIST_ACTIONS.CLEAR_EVENTS_LIST:
            return "";
        default:
            return state;
    }
}

const isInitialLoading = (state = true, action) => {
    switch (action.type) {
        case EVENTS_LIST_ACTIONS.FETCH_EVENTS_LIST_INIT:
            return true;
        case EVENTS_LIST_ACTIONS.INITIAL_EVENTS_LIST_FETCHED:
            return false;
        case EVENTS_LIST_ACTIONS.INITIAL_EVENTS_FETCH_FAILED:
            return false;
        default:
            return state;
    }

}



const eventsListManagement = combineReducers({
    events,
    isInitialLoading,
    initialFetchErrorMessage
});

export default eventsListManagement;

///////////////SELECTORS//////////////////////////
export const getEventsList = state => state.events;
export const getInitialListIsLoading = state => state.isInitialLoading;
export const getInitialListFetchErrorMessage = state => state.initialFetchErrorMessage;

