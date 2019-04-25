import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Form from './Form';
import ListView from './ListView';
import MapView from "./MapView";

const Main = () => (
  <main className="Main">
    <Switch>
      <Route exact path="/" component={MapView}/>
      <Route exact path="/reports/create" component={Form}/>
      <Route exact path="/list" component={ListView}/>
    </Switch>
  </main>
);

export default Main;
