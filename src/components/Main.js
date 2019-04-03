import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Form from './Form';
import Map from './Map';

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Map}/>
      <Route exact path="/reports/create" component={Form}/>
    </Switch>
  </main>
);

export default Main;
