import getStatusSvc from "../services/status";

const EVENTS_LIST_ACTIONS = {
    FETCH_EVENTS_LIST_INIT: "FETCH_EVENTS_LIST_INIT",
    INITIAL_EVENTS_LIST_FETCHED: "INITIAL_EVENTS_LIST_FETCHED",
    INITIAL_EVENTS_FETCH_FAILED:"INITIAL_EVENTS_FETCH_FAILED",
    FETCH_EVENTS_LIST_DELTA: "FETCH_EVENTS_LIST_DELTA",
    EVENTS_LIST_DELTA_FETCHED: "EVENTS_LIST_DELTA_FETCHED",
    CLEAR_EVENTS_LIST:"CLEAR_EVENTS_LIST"
}

export const fetchEventsListOnInit = () => ({
    type: EVENTS_LIST_ACTIONS.FETCH_EVENTS_LIST_INIT
});


export const handleFetchEventsListOnInit = (token) => {
    //console.log("fetchEventsListOnInit");
    return (dispatch) => {
        dispatch(fetchEventsListOnInit());
        return getStatusSvc(token, 0)
            .then(data => {
                //console.log("eventsListOnInitFetched",data);
                if (data.success) {
                    dispatch(eventsListOnInitFetched(data));
                } else {
                    dispatch(eventsListOnInitFetchFailed(data));
                }
                
            })

    }
};

export const eventsListOnInitFetched = (data) => ({
    type: EVENTS_LIST_ACTIONS.INITIAL_EVENTS_LIST_FETCHED,
    data
});

export const eventsListOnInitFetchFailed = (data) => ({
    type: EVENTS_LIST_ACTIONS.INITIAL_EVENTS_FETCH_FAILED,
    data
});

export const fetchEventsListDelta = () => ({
    type: EVENTS_LIST_ACTIONS.FETCH_EVENTS_LIST_DELTA
});

export const handleFetchEventsListDelta = (token, ts) => {
    //console.log("handleFetchEventsListDelta",ts);
    return (dispatch) => {
        dispatch(fetchEventsListDelta());
        return getStatusSvc(token, ts)
            .then(data => {
                //console.log("eventsListOnInitFetched",data);
                if (data.success) {
                    dispatch(eventsListDeltaFetched(data));
                }

            })

    }
}

export const eventsListDeltaFetched = (data) => ({
    type: EVENTS_LIST_ACTIONS.EVENTS_LIST_DELTA_FETCHED,
    data
});

export const clearEventsList = () => ({
    type: EVENTS_LIST_ACTIONS.CLEAR_EVENTS_LIST
});

export default EVENTS_LIST_ACTIONS;