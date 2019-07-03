import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Firebase, { FirebaseContext } from './components/Firebase';
import { Provider } from 'react-redux';
import { store } from './store/index';

import './index.css';
import App from './App';
import ScrollToTop from "./components/ScrollToTop";

ReactDOM.render((
    <BrowserRouter basename="urban-carnivore-spotter">
      <ScrollToTop>
        <Provider store={store}>
          <FirebaseContext.Provider value={new Firebase()}>
            <App/>
          </FirebaseContext.Provider>
        </Provider>
      </ScrollToTop>
    </BrowserRouter>),
  document.getElementById('root'));


