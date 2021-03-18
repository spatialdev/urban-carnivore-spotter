import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Sticky from "react-sticky-fill";
import AppBar from "@material-ui/core/AppBar";
import "../App.css";
import { connect } from "react-redux";
import Logo from './Logo';
import HeaderNav from './HeaderNav';

class DesktopHeader extends Component {
  render () {
    const { history } = this.props;
    const isTacoma = history.location.pathname.indexOf( "tacoma" ) !== -1;
    return (
      <Sticky style={ { top: 0, width: "100%", zIndex: 100 } }>
        <AppBar position="static" className="appBar">
          <Logo />
          <h1
            className={ isTacoma ? "headerTitle" : "headerTitle" }
            onClick={ () =>
              isTacoma ? history.push( "/tacoma" ) : history.push( "/" )
            }
            style={ { cursor: "pointer" } }
          >
            Carnivore Spotter
          </h1>
          <HeaderNav />
        </AppBar>
      </Sticky>
    );
  }
}

DesktopHeader.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = ( state ) => {
  return {
    isMobile: state.isMobile,
  };
};

export default withRouter( connect( mapStateToProps )( DesktopHeader ) );
