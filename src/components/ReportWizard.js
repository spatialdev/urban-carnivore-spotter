import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

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

class ReportWizard extends Component {
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
      <div>
        <Button onClick={this.toggleDrawer(!open)}>Open Bottom</Button>
        <SwipeableDrawer
          anchor="bottom"
          open={open}
          onClose={this.toggleDrawer(!open)}
          onOpen={this.toggleDrawer(!open)}
          className="formWizard"
        >
          <div tabIndex={0} style={{height: '100vh'}}>
            <div>
            <Fab color="primary" aria-label="Add" className={classes.fab}>
              <ClearIcon onClick={this.toggleDrawer(!open)} />
            </Fab>
            <h2>Report a carnivore sighting</h2>
            </div>
            <Form/>
          </div>
        </SwipeableDrawer>
      </div>
    );
  }

}

ReportWizard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReportWizard);