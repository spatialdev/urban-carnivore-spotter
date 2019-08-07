import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Sticky from 'react-sticky-fill';
import AppBar from '@material-ui/core/AppBar';
import '../App.css';
import {connect} from "react-redux";

class DesktopHeader extends Component {

  render() {
    const { history } = this.props;
    return (
      <Sticky style={{top: 0, width: '100%', zIndex: 100}}>
        <AppBar position="static" className="appBar">
          <div className="logo"/>
          <h1 className="headerTitle" onClick={() => history.push('/')} style={{ cursor: 'pointer' }}>
            Carnivore Spotter
          </h1>
          <div className="nav">
            <div id="explore" className="categories" onClick={() => history.push('/')}><h4 style={{textDecoration: history.location.pathname==='/'? "underline":""}}>Explore</h4></div>
            <div id="resources" className="categories" onClick={() =>history.push('/resources')}><h4 style={{textDecoration: history.location.pathname==='/resources'? "underline":""}}>Resources</h4>
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
    isMobile: state.isMobile
  };
};

export default withRouter(connect(mapStateToProps)(DesktopHeader));
