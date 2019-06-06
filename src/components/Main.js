import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Form from './Form';
import ListView from './ListView';
import MapView from "./MapView";
import ReportViewer from "./ReportViewer";
import NotFound from './NotFound';

const Main = () => (
  <main className="Main">
    <Switch>
      <Route exact path="/" render={() => <MapView/>}/>
      <Route exact path="/reports/create" component={Form}/>
      <Route exact path="/list" component={ListView}/>
      <Route exact path="/reports/:id" component={ReportViewer}/>
      <Route component={NotFound}/>
    </Switch>
  </main>
);

export default Main;
