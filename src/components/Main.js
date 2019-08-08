import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Form from './Form';
import ListView from './ListView';
import MapView from "./MapView";
import ReportViewer from "./ReportViewer";
import NotFound from './NotFound';
import ResourceCard from "./ResourceCard";
import Resources from "./Resources";
import SplashPage from "./SplashPage";


const Main = () => (
  <main className="Main">
    <Switch>
      <Route exact path="/" render={() => <MapView/>}/>
      <Route exact path="/reports/create" component={Form}/>
      <Route exact path="/list" component={ListView}/>
      <Route exact path="/reports/:id" component={ReportViewer}/>
      <Route exact path="/resources" component={Resources}/>
      <Route exact path="/resources/:species" component={ResourceCard}/>
      <Route component={NotFound}/>
    </Switch>
    <SplashPage />
  </main>
);

export default Main;
