import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Sticky from 'react-sticky-fill';
import AppBar from '@material-ui/core/AppBar';

import '../App.css';

class DesktopHeader extends Component {
  state = {
    isOnExplore : true
  };

  goToResourcesPage  = (isOnExplore, history) => {
    history.push('/resources');
    this.setState({isOnExplore: false})
  };
  goToExplorePage = (isOnExplore, history) => {
    history.push('/');
    this.setState({isOnExplore: true})
  };

  render() {
    const { isOnExplore } = this.state;
    const { history } = this.props;
    return (
      <Sticky style={{top: 0, width: '100%', zIndex: 100}}>
        <AppBar position="static" className="appBar">
          <div className="logo"/>
          <h1 className="headerTitle" onClick={() => history.push('/')} style={{ cursor: 'pointer' }}>
            Urban Carnivore Sightings
          </h1>
          <div className="nav">
            <div id="explore" className="categories" onClick={() =>this.goToExplorePage(isOnExplore,history)}><h4 style={{textDecoration: isOnExplore? "underline":""}}>Explore</h4></div>
            <div id="resources" className="categories" onClick={() =>this.goToResourcesPage(isOnExplore,history)}><h4 style={{textDecoration: !isOnExplore? "underline":""}}>Resources</h4>
            </div>
          </div>
        </AppBar>
      </Sticky>
    );
  }
}

DesktopHeader.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(DesktopHeader);
