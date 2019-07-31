import React, { Component } from 'react';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import MapIcon from '@material-ui/icons/Map';
import SettingsIcon from '@material-ui/icons/Settings';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/core/styles';
import { setOnExplore } from '../store/actions';

import Form from './Form';
import { withRouter } from "react-router";
import {connect} from "react-redux";

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
  footerIconDiv: {
    borderTop: "1px grey solid",
    width: "100%",
    bottom: 0,
    left: 0,
    padding: "25px 0",
    backgroundColor: "white",
    position: "sticky",
    zIndex: "101",
    display: "flex",
    justifyContent: "space-around",
  },
  flexColumn: {
    flexGrow: 1,
    flexBasis: "30%",
  },
  plusButton: {
    position: "relative",
    top: -50,
  },
  footerIcons: {
    '& span': {
      display: 'block'
    },
    '& p': {
      textTransform: 'capitalize',
      margin: 0
    }
  }
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
    const { classes, history, isOnExplore } = this.props;

    return (
      <div className={classes.footerIconDiv}>
        <div className={classes.flexColumn}>
          <Button className={classes.footerIcons} style={{ float: 'left', marginLeft: '50px', color: isOnExplore===0? '#3411ff': 'grey' }} >
            <MapIcon style={{ color: isOnExplore===0? '#3411FF': 'grey' }} onClick={() => {history.push('/');
            setOnExplore(0)}}/>
            <p>Explore</p>
          </Button>
        </div>
        <div className={classes.flexColumn}>
          <Fab color="primary" aria-label="Add" className={classes.plusButton} size="large" onClick={this.toggleDrawer(!open)}>
            <AddIcon/>
          </Fab>
          <Drawer
          anchor="bottom"
          open={open}
          onClose={this.toggleDrawer(!open)}
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
        </div>
        <div className={classes.flexColumn}>
          <Button className={classes.footerIcons} style={{ float: 'right', marginRight: '50px', color: isOnExplore===1? '#3411FF': 'grey' }} onClick={() => {
            history.push('/resources');
            setOnExplore(1)
          }}>
            <SettingsIcon style={{ color: isOnExplore===1? '#3411FF': 'grey' }} />
            <p>Resources</p>
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOnExplore: state.isOnExplore
  };
};

export default withRouter(connect(mapStateToProps)(withStyles(styles)(Footer)));
