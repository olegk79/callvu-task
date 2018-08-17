//dependencies
import { Component } from "react";
import { connect } from "react-redux";

import Settings from "./Settings";
import EventsList from "./EventsList";

import Paper from "material-ui/Paper";
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from "material-ui/CircularProgress";

// actions
import { handleFetchEventsListOnInit, handleFetchEventsListDelta, clearEventsList } from "../actions/eventsListActions";
import { handleStopMonitor, handleStartMonitor, handleLogout } from "../actions/settingsActions";

// services
import { getSessionToken } from "../services/localStorage";

import isValid from 'is-valid-path';
//import getStatusSvc from "../services/status";

//State Selectors
import {
    getEventsList,
    getEventsInitialListIsLoading,
    getUserMonitoringInfo,
    getMonitorStatusIsUpdating,
    getMonitorIsLoggingOut,
    getInitialListFetchErrorMessage
} from "../reducers";


class Monitor extends Component {
    state = {
        folderInputError: "",
        folder: ""
    }

    componentDidMount() {
        const sessionToken = getSessionToken();
        //console.log(sessionToken);
        if (!sessionToken) {
            this.props.history.push("/login");
        } else {
            this._sessionToken = sessionToken;
            this.props.handleFetchEventsListOnInit(sessionToken);
            
        }
    }

    //componentWillUnmount() {
    //    this.props.clearEventsList();
    //}

    componentWillReceiveProps(nextProps) {
        // just finished to fetch initial list of events
        if (this.props.isLoading === true && nextProps.isLoading === false) {
            //console.log("set interval");
            setInterval(() => {
                this.fetchDelta();
            }, 1000);
        }
        // jsut finished logout
        if (this.props.isLoggingOut === true && nextProps.isLoggingOut === false) {
            this.props.history.push("/login");
        }
    }

    fetchDelta() {
        const { eventsList } = this.props;
        // take the last element in events array as "timestamp to fetch events happened later than"
        // in order to fetch only "delta" of events
        let ts = eventsList.length > 0 ? eventsList[eventsList.length - 1].timestamp : 0;
        //console.log(ts);
        this.props.handleFetchEventsListDelta(this._sessionToken, ts);
    }

    onFolderTextChange(event) {
        this.setState({
            folder: event.target.value
        });
    }

    onStartButtonClick() {
        let valid = isValid(this.state.folder);
        if (valid) {
            this.props.handleStartMonitor(this._sessionToken, this.state.folder);
            this.props.clearEventsList();
            this.setState({
                folderInputError: ""
            });
        } else
        {
            this.setState({
                folderInputError: "Folder is invalid"
            });
        }
        
    }

    onStopButtonClick() {
        this.props.handleStopMonitor(this._sessionToken);
    }

    onLogoutButtonClick() {
        this.props.handleLogout(this._sessionToken);
    }

    render() {
        const { eventsList,
            isLoading,
            monitorInfo,
            isMonitorStatusUpdating,
            isLoggingOut,
            loadErrorMessage
        } = this.props;

        const { folderInputError, folder } = this.state;

        const style = {
            paper: {
                borderRadius: 50
            },
            loadingDiv: {
                margin: "10px auto 0px 0px",
                textAlign: "center"
            },
            loadingProgress: {
                width: 100,
                display: "inline-block"
            },
            logoutDiv: {
                float: "right",
                marginTop: -30
            },
            errorDiv: {
                margin: "5px auto 0px 0px",
                textAlign: "center"
            },
            errorLabel: {
                fontSize: 18,
                fontWeight: "bold",
                display: "inline-block",
                color: "red"
            }
        }

        

        return <Paper zDepth={5} style={style.paper}>
            <div style={style.logoutDiv}>
                {
                    isLoggingOut === false ? <FlatButton name="btnLogout" label="Logout" onClick={() => this.onLogoutButtonClick()} /> :
                        <CircularProgress />
                }
                </div>
           
            <Settings folder={folder} onFolderTextChange={(event) => this.onFolderTextChange(event)}
                monitorInfo={monitorInfo}
                folderInputError={folderInputError}
                isMonitorStatusUpdating={isMonitorStatusUpdating}
                onStartButtonClick={() => this.onStartButtonClick()}
                onStopButtonClick={() => this.onStopButtonClick()} />
            {
                isLoading === false ?
                    (loadErrorMessage === "" ? <EventsList events={eventsList} /> : null)
                    :
                    <div style={style.loadingDiv}><CircularProgress style={style.loadingDiv} /></div>       
            }
            {
                loadErrorMessage !== "" && <div style={style.errorDiv}><label style={style.errorLabel}>{loadErrorMessage}</label></div>
            }
        </Paper>

        return <div>Hello monitor</div>;
    }
}

const mapStateToProps = state => ({
    eventsList: getEventsList(state),
    isLoading: getEventsInitialListIsLoading(state),
    monitorInfo: getUserMonitoringInfo(state),
    isMonitorStatusUpdating: getMonitorStatusIsUpdating(state),
    isLoggingOut: getMonitorIsLoggingOut(state),
    loadErrorMessage: getInitialListFetchErrorMessage(state)
});

export default connect(mapStateToProps, {
    handleFetchEventsListOnInit,
    handleStopMonitor,
    handleStartMonitor,
    handleFetchEventsListDelta,
    clearEventsList,
    handleLogout
})(Monitor);