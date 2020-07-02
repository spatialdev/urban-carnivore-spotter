import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Sticky from 'react-sticky-fill';
import AppBar from '@material-ui/core/AppBar';
import '../App.css';
import {connect} from "react-redux";
import zooLogo from '../assets/logo.png';
import tacomaLogo from '../assets/tacomaLogo.png'

class DesktopHeader extends Component {

  render() {
    const { history } = this.props;
    const isTacoma = history.location.pathname.indexOf('tacoma') !== -1;
    return (
      <Sticky style={{top: 0, width: '100%', zIndex: 100}}>
        <AppBar position="static" className="appBar">
            {isTacoma ?  <div className="logoContainer"><img className="logo2" src={tacomaLogo} alt={"Pt. Defiance Zoo logo"}/></div> :  <div className="logoContainer"><img className="logo" src={zooLogo} alt={"Woodland Park Zoo logo"}/></div>}
          <h1 className={isTacoma? "headerTitle" : "headerTitle"} onClick={() => isTacoma ? history.push('/tacoma') : history.push('/')} style={{ cursor: 'pointer' }}>
            Carnivore Spotter
          </h1>
          <div className="nav">
            <div id="explore" className="categories" onClick={() => isTacoma ? history.push('/tacoma') : history.push('/')}><h4 style={{textDecoration: history.location.pathname==='/' || history.location.pathname==='/tacoma' ? "underline":""}}>Explore</h4></div>
            <div id="resources" className="categories" onClick={() => isTacoma ? history.push('/tacoma/resources'): history.push('/resources')}><h4 style={{textDecoration: history.location.pathname==='/resources' ||history.location.pathname==='/tacoma/resources'? "underline":""}}>Resources</h4>
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
