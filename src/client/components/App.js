import {
    HashRouter,
    Route,
    Redirect,
    Switch
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../store'

//import React from "react";

import Login from "./Login";
import Monitor from "./Monitor";


export default ({ }) => (
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route exact path='/login' component={Login} />
                <Route exact path='/monitor' component={Monitor} />
                <Redirect from='/' to='/monitor' />
            </Switch>
        </HashRouter>
    </Provider>
);
