import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Form from './Form';
import Map from './Map';
import ListView from './ListView';
import ReportViewer from "./ReportViewer";

const Main = () => (
  <main className="Main">
    <Switch>
      <Route exact path="/" component={Map}/>
      <Route exact path="/reports/create" component={Form}/>
      <Route exact path="/list" component={ListView}/>
      <Route exact path="/reports/:id" component={ReportViewer}/>
    </Switch>
  </main>
);

export default Main;
