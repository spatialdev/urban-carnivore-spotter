import React, { Component } from 'react';

import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import MapIcon from '@material-ui/icons/Map';
import SettingsIcon from '@material-ui/icons/Settings';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { withStyles } from '@material-ui/core/styles';

import Form from './Form';


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

  toggleDrawer = drawerState => () => {
    this.setState({
      open: drawerState
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
        <SwipeableDrawer
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
              <h2>Report a carnivore sighting</h2>
            </div>
            <Form/>
          </div>
        </SwipeableDrawer>
        <Button className="footerIcons" style={{ float: 'right', marginRight: '50px' }}>
          <SettingsIcon style={{ color: 'gray' }}/>
          <p>Resources</p>
        </Button>
      </div>
    );

  }
}

export default withStyles(styles)(Footer);
