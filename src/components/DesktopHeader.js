import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';

import '../App.css';

class DesktopHeader extends Component {

  render() {
    const { history } = this.props;

    return (
      <div style={{ position: 'sticky', top: 0, width: '100%', zIndex: 100 }}>
        <AppBar position="static" className="appBar">
          <div className="logo"/>
          <h1 className="headerTitle" onClick={() => history.push('/')} style={{ cursor: 'pointer' }}>
            Urban Carnivore Sightings
          </h1>
          <div className="nav">
            <div id="explore" className="categories" onClick={() => history.push('/')}><h4>Explore</h4></div>
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

export default withRouter(DesktopHeader);
