import { createStore } from 'redux';
import { reducer, initialState } from './reducers';


console.log(initialState);
const store = createStore(reducer, initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
console.log(store);
export {store};