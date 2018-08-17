import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/index';

// Note: this API requires redux@>=3.1.0
const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
);

//subscribing to the store so it's state will be logged on every dispatch
//store.subscribe(() => {
//    console.log(store.getState()) //logging the store's state
//});
//console.log(store.getState()); // log initial state

export default store;