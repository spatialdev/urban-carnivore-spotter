import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Form from './Form';

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/reports/create" component={Form}/>
    </Switch>
  </main>
);
export default Main;