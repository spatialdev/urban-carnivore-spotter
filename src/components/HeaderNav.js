import React, { Component } from "react";
import "../App.css";
import NavCategory from './NavCategory';

class HeaderNav extends Component {
  render () {
    return (
      <div className="nav">
        <NavCategory
          route="/"
          tacomaRoute="/tacoma"
          label="Explore"
          id="explore"
        />
        <NavCategory
          route="/resources"
          tacomaRoute="/tacoma/resources"
          label="Resources"
          id="resources"
        />
        <NavCategory
          route="/faq"
          tacomaRoute="/faq"
          label="FAQ"
          id="faq"
        />
      </div>
    );
  }
}

export default HeaderNav;
