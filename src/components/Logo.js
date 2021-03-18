import React, { Component } from "react";
import "../App.css";
import { withRouter } from "react-router-dom";
import zooLogo from "../assets/logo.png";
import tacomaLogo from "../assets/tacomaLogo.png";

class Logo extends Component {
  render () {
    const { history } = this.props;
    const isTacoma = history.location.pathname.indexOf( "tacoma" ) !== -1;
    return (
      <>
        { isTacoma ? (
          <div className="logoContainer">
            <img
              className="logo2"
              src={ tacomaLogo }
              alt={ "Pt. Defiance Zoo logo" }
            />
          </div>
        ) : (
            <div className="logoContainer">
              <img
                className="logo"
                src={ zooLogo }
                alt={ "Woodland Park Zoo logo" }
              />
            </div>
          ) }
      </>
    );
  }
}

export default withRouter( Logo );
