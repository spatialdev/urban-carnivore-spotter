import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Form from './Form';
import Map from './Map';
import FilterDrawer from './FilterDrawer';

const Main = () => (
  <main className="Main">
    <Switch>
      <Route exact path="/" component={Map}/>
      <Route exact path="/reports/create" component={Form}/>
      <Route exact path="/filters" component={FilterDrawer}/>
    </Switch>
  </main>
);

export default Main;
