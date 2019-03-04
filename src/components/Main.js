import React from 'react';
import { Switch, Route } from 'react-router-dom';

import ListView from '../components/ListView';
import ReportWizard from '../components/ReportWizard';
import ReportViewer from '../components/ReportViewer';

const Main = () => (
  <main>
    <Switch>
      {/*<Route exact path="/map" component={Map}/>*/}
      {/*<Route exact path="/reports/view/:reportId" component={ReportViewer} />*/}
      <Route exact path="/reports/create" component={ReportWizard}/>
      {/*<Route exact path="/list"  component={ListView} />*/}
    </Switch>
  </main>
);
export default Main;