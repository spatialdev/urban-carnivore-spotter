import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import Menu from '@material-ui/icons/Menu';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer/SwipeableDrawer';
import Toolbar from '@material-ui/core/Toolbar';

import '../App.css';

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

class Header extends Component {
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
        const {history} = this.props;
        return (
            <div>
                <AppBar position="static" color="default">
                    <div className="headerDiv">
                        <div className="topHeader">
                            <Button className="moreIcon"
                                    onClick={this.toggleDrawer('left', true)}><Menu/></Button>
                            <SwipeableDrawer
                                disableBackdropTransition={!iOS}
                                disableDiscovery={iOS}
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
                                    style={{width: '250px'}}
                                >
                                    <List>
                                        <ListItem className="drawerItem"><h3>Item</h3></ListItem>
                                        <ListItem className="drawerItem"><h3>Item</h3></ListItem>
                                        <ListItem className="drawerItem"><h3>Item</h3></ListItem>
                                    </List>
                                </div>
                            </SwipeableDrawer>
                        </div>
                        <h1 style={{display: 'table-cell', cursor: 'pointer'}}
                            onClick={() => history.push('/')} className="header">Urban Carnivore Spotter</h1>
                    </div>
                    <Toolbar className="toolbar">
                        <Button className="filterButton" onClick={this.toggleDrawer('right', true)}>Filter</Button>
                        <SwipeableDrawer
                            disableBackdropTransition={!iOS}
                            disableDiscovery={iOS}
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
                                style={{width: '250px'}}
                            >
                                <List>
                                    <ListItem className="drawerItem"><h3>Item</h3></ListItem>
                                    <ListItem className="drawerItem"><h3>Item</h3></ListItem>
                                    <ListItem className="drawerItem"><h3>Item</h3></ListItem>
                                </List>
                            </div>
                        </SwipeableDrawer>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withRouter(Header);