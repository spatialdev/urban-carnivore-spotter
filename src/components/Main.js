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
        render={() => <Form />}
      />
      <Route exact path="/(list|tacoma/list)" render={() => <ListView />} />
      <Route exact path="/reports/:id" render={() => <ReportViewer />} />
      <Route exact path="/tacoma/reports/:id" render={() => <ReportViewer />} />
      <Route
        exact
        path="/tacoma/reports/tacoma/:id"
        render={() => <ReportViewer />}
      />
      <Route
        exact
        path="/(resources|tacoma/resources)"
        render={() => <Resources />}
      />
      <Route exact path="/resources/:species" render={() => <ResourceCard />} />
      <Route
        exact
        path="/tacoma/resources/:species"
        render={() => <ResourceCard />}
      />
      <Route exact path="/faq" render={() => <FAQ />} />
      <Route render={() => <NotFound />} />
    </Switch>
    <SplashPage />
    <UnsupportedBrowserNotice />
  </main>
);

export default Main;
