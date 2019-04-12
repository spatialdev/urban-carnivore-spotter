import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import Menu from '@material-ui/icons/Menu';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer/SwipeableDrawer';

import '../App.css';

const styles = {
  moreIcon: {
    float: 'right',
    display: 'inline',
    color: 'white',
    paddingBottom: 0,
  },
};

class DesktopHeader extends Component {
  state = {
    right: false,
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  render() {
    const { classes, history } = this.props;

    return (
      <div style={{ position: 'fixed', width: '100%' }}>
        <AppBar position="static" className="appBar">
          <div className="logo"/>
          <h1 className="headerTitle" onClick={() => history.push('/')} style={{ cursor: 'pointer' }}>
            Urban Carnivore Sightings
          </h1>
          <Button className={classes.moreIcon} onClick={this.toggleDrawer('right', true)}><Menu/></Button>
          <SwipeableDrawer
            anchor="right"
            open={this.state.right}
            onClose={this.toggleDrawer('right', false)}
            onOpen={this.toggleDrawer('right', true)}
          >
            <div
              tabIndex={0}
              role="button"
              onClick={this.toggleDrawer('right', false)}
              onKeyDown={this.toggleDrawer('right', false)}
              style={{ width: '250px' }}
            >
              <List>
                <ListItem className="drawerItem"><h3>Stub</h3>
                </ListItem>
                <ListItem className="drawerItem"><h3>Stub</h3>
                </ListItem>
                <ListItem className="drawerItem"><h3>Stub</h3>
                </ListItem>
              </List>
            </div>
          </SwipeableDrawer>
          <div className="nav">
            <div id="explore" className="categories" onClick={() => history.push('/map')}><h4>Explore</h4></div>
            <div id="resources" className="categories" onClick={() => history.push('/resources')}><h4>Resources</h4>
            </div>
            <div id="report" className="categories" onClick={() => history.push('/reports/create')}><h4>Report
              Sightings</h4></div>
          </div>

        </AppBar>
      </div>
    );
  }
}

DesktopHeader.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(DesktopHeader));
