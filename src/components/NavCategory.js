import React, { Component } from "react";
import "../App.css";
import { withRouter } from "react-router-dom";

class NavCategory extends Component {
  render () {
    const { history, tacomaRoute, route, label, id } = this.props;
    const isTacoma = history.location.pathname.indexOf( "tacoma" ) !== -1;
    return (
      <div
        id={ id }
        className="categories"
        onClick={ () =>
          isTacoma ? history.push( tacomaRoute ) : history.push( route )
        }
      >
        <h4
          style={ {
            fontSize: "0.85em",
            letterSpacing: "2px",
            paddingBottom: "1.5em",
            borderBottom:
              history.location.pathname === route ||
                history.location.pathname === tacomaRoute
                ? "2px solid rgba(2,2,30,0.85)"
                : "",
          } }
        >
          { label }
        </h4>
      </div>
    );
  }
}

export default withRouter( NavCategory );
