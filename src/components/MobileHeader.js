import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import Menu from '@material-ui/icons/Menu';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer/SwipeableDrawer';

import '../App.css';

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
    const { history, location } = this.props;
    console.log(this.props);
    return (
      <div style={{ position: 'fixed', width: '100%', zIndex: 100 }}>
        <AppBar position="static" color="default">
          <div className="headerDiv">
            <div className="topHeader">
              <Button className="moreIcon" onClick={this.toggleDrawer('left', true)}><Menu/></Button>
              <SwipeableDrawer
                anchor="left"
                open={this.state.left}
                onClose={this.toggleDrawer('left', false)}
                onOpen={this.toggleDrawer('left', true)}
              >
                <div
                  tabIndex={0}
                  role="button"
                  onClick={this.toggleDrawer('left', false)}
                  onKeyDown={this.toggleDrawer('left', false)}
                  style={{ width: '250px' }}
                >
                  <List>
                    <ListItem className="drawerItem"><h3>Item</h3></ListItem>
                    <ListItem className="drawerItem"><h3>Item</h3></ListItem>
                    <ListItem className="drawerItem"><h3>Item</h3></ListItem>
                  </List>
                </div>
              </SwipeableDrawer>
            </div>
            <h1 style={{ display: 'table-cell', cursor: 'pointer' }}
                onClick={() => history.push('/')} className="header">Urban Carnivore Spotter</h1>
            {location.pathname === '/' || location.pathname === '/list' ?
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
                onClick={this.toggleDrawer('right', false)}
                onKeyDown={this.toggleDrawer('right', false)}
                style={{ width: '250px' }}
              >
                <List>
                  <ListItem className="drawerItem"><h3>Item</h3></ListItem>
                  <ListItem className="drawerItem"><h3>Item</h3></ListItem>
                  <ListItem className="drawerItem"><h3>Item</h3></ListItem>
                </List>
              </div>
            </SwipeableDrawer>
          </div>
        </AppBar>
      </div>
    );
  }
}

export default withRouter(MobileHeader);
