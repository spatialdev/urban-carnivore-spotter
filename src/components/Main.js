import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Form from './Form';
import ListView from './ListView';
import MapView from "./MapView";
import ReportViewer from "./ReportViewer";
import NotFound from './NotFound';
import ResourceCard from "./ResourceCard";
import Resources from "./Resources";
import {Dialog, DialogContent} from "@material-ui/core";
import {withCookies} from "react-cookie";

const VISITED_BEFORE = "visitedBefore";

const Main = (props) => (
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
    <Dialog open={!props.cookies.get(VISITED_BEFORE)}
      onClose={() => props.cookies.set(VISITED_BEFORE, true)}>
      <DialogContent>
        <p>The Seattle Urban Carnivore project is a partnership between Woodland Park Zoo and Seattle University and aims to explore how mammalian carnivores live and interact with people across urban and suburban areas in the Seattle region.</p>
        <p>The project focuses on the following species:</p>
        <ul>
          <li>Black Bear</li>
          <li>Bobcat</li>
          <li>Cougar / Mountain Lion</li>
          <li>Coyote</li>
          <li>Opossum</li>
          <li>Raccoon</li>
          <li>River Otter</li>
        </ul>
        <p>These are terrestrial (not marine) mammals in the taxonomic Order Carnivora (*except for opossums). Some of them have a carnivorous diet (eating other animals). Many of them, however, have an omnivorous diet, eating plants as well as animals.</p>
        <p>You can use this observation form to submit observations of any of the above animals (or if you think you may have seen one of them, but aren’t sure!)</p>
      </DialogContent>
    </Dialog>
  </main>
);

export default withCookies(Main);
