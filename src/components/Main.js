import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Form from './Form';
import Map from './Map';
import ListView from './ListView';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  main: {
    flexGrow: 1
  }
});

const Main = (props) => {
  const {classes} = props;
  return <main className={classes.main}>
    <Switch>
      <Route exact path="/" component={Map}/>
      <Route exact path="/reports/create" component={Form}/>
      <Route exact path="/list" component={ListView}/>
    </Switch>
  </main>
}

export default withStyles(styles)(Main);