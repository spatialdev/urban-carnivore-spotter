import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Sticky from 'react-sticky-fill';
import AppBar from '@material-ui/core/AppBar';
import '../App.css';
import {connect} from "react-redux";
import { setOnExplore } from '../store/actions';

class DesktopHeader extends Component {

  goToResourcesPage  = ( history) => {
    history.push('/resources');
    setOnExplore(1)

  };
  goToExplorePage = ( history) => {
    history.push('/');
    setOnExplore(0)
  };

  render() {
    const { history, isOnExplore } = this.props;
    return (
      <Sticky style={{top: 0, width: '100%', zIndex: 100}}>
        <AppBar position="static" className="appBar">
          <div className="logo"/>
          <h1 className="headerTitle" onClick={() => history.push('/')} style={{ cursor: 'pointer' }}>
            Urban Carnivore Sightings
          </h1>
          <div className="nav">
            <div id="explore" className="categories" onClick={() =>this.goToExplorePage(history)}><h4 style={{textDecoration: isOnExplore===0? "underline":""}}>Explore</h4></div>
            <div id="resources" className="categories" onClick={() =>this.goToResourcesPage(history)}><h4 style={{textDecoration: isOnExplore===1? "underline":""}}>Resources</h4>
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

const mapStateToProps = (state) => {
  return {
    isMobile: state.isMobile,
    isOnExplore: state.isOnExplore
  };
};

export default withRouter(connect(mapStateToProps)(DesktopHeader));
