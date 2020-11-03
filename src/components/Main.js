import React from "react";
import { Switch, Route } from "react-router-dom";

import Form from "./Form";
import ListView from "./ListView";
import MapView from "./MapView";
import ReportViewer from "./ReportViewer";
import NotFound from "./NotFound";
import ResourceCard from "./ResourceCard";
import Resources from "./Resources";
import UnsupportedBrowserNotice from "./UnsupportedBrowserNotice";
import SplashPage from "./SplashPage";
import FAQ from "./FAQ";

const Main = () => (
  <main className="Main">
    <Switch>
      <Route exact path="/" render={() => <MapView />} />
      <Route exact path="/tacoma" render={() => <MapView />} />
      <Route
        exact
        path="/(reports/create|tacoma/reports/create)"
        component={Form}
      />
      <Route exact path="/(list|tacoma/list)" component={ListView} />
      <Route exact path="/reports/:id" component={ReportViewer} />
      <Route exact path="/tacoma/reports/:id" component={ReportViewer} />
      <Route exact path="/tacoma/reports/tacoma/:id" component={ReportViewer} />
      <Route exact path="/(resources|tacoma/resources)" component={Resources} />
      <Route exact path="/resources/:species" component={ResourceCard} />
      <Route exact path="/tacoma/resources/:species" component={ResourceCard} />
      <Route exact path="/faq" component={FAQ} />
      <Route component={NotFound} />
    </Switch>
    <SplashPage />
    <UnsupportedBrowserNotice />
  </main>
);

export default Main;
