import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer/SwipeableDrawer';
import Sticky from 'react-sticky-fill';

import FilterDrawer from './FilterDrawer';

import '../App.css';

const styles = {
  filterContainer: {
    height: '100vh'
  }
};
class MobileHeader extends Component {
  state = {
    left: false,
    right: false,
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  render() {
    const { history, location, classes} = this.props;

    return (
      <Sticky style={{top: 0, width: '100%', zIndex: 100}}>
        <AppBar position="static" color="default">
          <div className="headerDiv">
            <h1 style={{ display: 'table-cell', cursor: 'pointer', marginLeft: 20}}
                onClick={() => location.pathname.indexOf('tacoma') !== -1 ? history.push('/tacoma') : history.push('/')} className="header">Carnivore Spotter</h1>
            {location.pathname === '/' || location.pathname === '/list' || location.pathname === '/tacoma' || location.pathname === '/tacoma/list' ?
              <Button className="filterButton" onClick={this.toggleDrawer('right', true)}>Filter</Button> :
              null
            }
            <SwipeableDrawer
              anchor="right"
              open={this.state.right}
              onClose={this.toggleDrawer('right', false)}
              onOpen={this.toggleDrawer('right', true)}
            >
              <div
                tabIndex={0}
                role="button"
                style={{ width: '250px' }}
              >
                <div className={classes.filterContainer}>
                  <FilterDrawer close={this.toggleDrawer('right', false)}/>
                </div>
              </div>
            </SwipeableDrawer>
          </div>
        </AppBar>
      </Sticky>
    );
  }
}

export default withStyles(styles)(withRouter(MobileHeader));
