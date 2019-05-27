import { createStore } from 'redux';
import { reducer, initialState } from './reducers';


const store = createStore(reducer, initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export {store};
