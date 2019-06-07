import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Firebase, { FirebaseContext } from './components/Firebase';
import { Provider } from 'react-redux';
import { store } from './store/index';

import './index.css';
import App from './App';

ReactDOM.render((
    <BrowserRouter basename="urban-carnivore-spotter">
      <Provider store={store}>
        <FirebaseContext.Provider value={new Firebase()}>
          <App/>
        </FirebaseContext.Provider>
      </Provider>
    </BrowserRouter>),
  document.getElementById('root'));


