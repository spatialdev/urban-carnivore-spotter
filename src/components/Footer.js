import React, { Component } from 'react';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import MapIcon from '@material-ui/icons/Map';
import SettingsIcon from '@material-ui/icons/Settings';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/core/styles';

import Form from './Form';
import { withRouter } from "react-router";

const styles = theme => ({
  list: {
    width: 250,
  },
  fullList: {
    width: '100%',
  },
  fab: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});

class Footer extends Component {
  state = {
    open: false,
  };

  componentDidMount() {
    const { location } = this.props;
    if (window.innerWidth < 768 && location.pathname === '/reports/create') {
      this.handleDrawer(true);
    }
  }

  toggleDrawer = drawerState => () => {
    const { history } = this.props;
    const { open } = this.state;

    this.setState({
      open: drawerState
    }, () => {
      if (open) {
        history.push('/');
      } else {
        history.push('/reports/create');
      }
    });
  };

  handleDrawer = state => {
    this.setState({
      open: state
    });
  };

  render() {
    const { open } = this.state;
    const { classes } = this.props;

    return (
      <div className="footerIconDiv">
        <Button className="footerIcons" style={{ float: 'left', marginLeft: '50px' }}>
          <MapIcon style={{ color: 'gray' }}/>
          <p>Explore</p>
        </Button>
        <Fab color="primary" aria-label="Add" className="plusButton" size="large" onClick={this.toggleDrawer(!open)}>
          <AddIcon/>
        </Fab>
        <Drawer
          anchor="bottom"
          open={open}
          onClose={this.toggleDrawer(!open)}
          onOpen={this.toggleDrawer(!open)}
          className="formWizard"
        >
          <div tabIndex={0}>
            <div>
              <Fab color="primary" aria-label="Add" className={classes.fab}>
                <ClearIcon onClick={this.toggleDrawer(!open)}/>
              </Fab>
            </div>
            <Form handleDrawerState={this.handleDrawer} fromDrawer/>
          </div>
        </Drawer>
        <Button className="footerIcons" style={{ float: 'right', marginRight: '50px' }}>
          <SettingsIcon style={{ color: 'gray' }}/>
          <p>Resources</p>
        </Button>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(Footer));
