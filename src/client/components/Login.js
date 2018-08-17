//dependencies
import { Component } from "react";

// services
import { clearData, storeData } from "../services/localStorage";
import loginSvc from "../services/login";

//MUI Components
import CircularProgress from "material-ui/CircularProgress";
import Paper from "material-ui/Paper";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import Snackbar from "material-ui/Snackbar";

// errors
const PASSWORD_WRONG = "Username/password is wrong";
const INTERNAL_SERVER_ERROR = "Internal Server Error";

export default class Login extends Component {
    state = {
        /* Auth username*/
        username: "",
        /* Auth password*/
        password: "",
        /*is a sign-in process currently happening*/
        logging: false,
        /*login status*/
        status: "",
        /* login error message*/
        error: ""
    };

    /*handles changes in the components form fields*/
    handleFieldChange(stateKey, value) {
        this.setState({
            [stateKey]: value
        });
    }

    componentWillMount() {
        // *** CLEAR SESSION TOKEN !!! ***
        clearData();
    }

    /*signing in to the server with the Login form data*/
    signIn() {
        this.setState({
            logging: true
        });

        const { username, password } = this.state;
        // calling to login service
        loginSvc(username, password)
            .then(({ success, data, error }) => {
                if (success === true) {
                    this.setState({
                        logging: false,
                        error: ""
                    });
                    storeData(data);
                    /*navigate to the application's default route */
                    this.props.history.push("/");
                } else {
                    this.setState({
                        status: "error",
                        error,
                        logging: false
                    });
                }
            })

    }

    render() {
        const { username, state, password, error, status, logging } = this.state;

        const canLogin = username && password;

        const style = {

            paper: {
                borderRadius: 50,
                height: 400,
                width: 400,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                position: "fixed",
                top: "50%",
                left: "50%",
                marginTop: -200,
                marginLeft: -200
            },
            loginGroup: {
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                alignItems: "center",
                height: "30%"
            },
            raisedButton: {
                margin: 12
            },
            inputs: {
                width: "60%"
            },
            select: {
                textAlign: "left"
            }
        };

        return (
            <Paper zDepth={5} style={style.paper}>
                <div style={style.loginGroup}>

                    <TextField
                        hintText="Username"
                        onChange={(event, newValue) => this.handleFieldChange("username", newValue)}
                        
                        value={username}
                        type="text"
                        name="username"
                    />
                    <TextField
                        hintText="Password"
                        onChange={(event, newValue) => this.handleFieldChange("password", newValue)}
                        value={password}
                        type="password"
                        name="password"
                    />
                </div>
                <div className="submit">
                    {logging
                        ? <CircularProgress />
                        : <RaisedButton
                            disabled={!canLogin}
                            label="Login"
                            primary={true}
                            style={style.raisedButton}
                            type="Submit"
                            autoFocus={true}
                            onClick={()=>this.signIn()}
                        />}
                </div>



                
                <Snackbar
                    open={status === "error"}
                    message={error}
                    autoHideDuration={6000}
                    style={{
                        background: "red"
                    }}
                    onRequestClose={() => {
                        this.setState({
                            status: ""
                        });
                    }}
                />
            </Paper>
        );
    }
}