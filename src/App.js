import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import DesktopHeader from "./components/DesktopHeader";
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './components/Main';

import './App.css';

class App extends Component {
  state = {
    isMobile: false,
  };

  componentDidMount() {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkIfMobile);
  }

  checkIfMobile = () => {
    this.setState({ isMobile: window.innerWidth < 768 });
  };

  render() {
    const { isMobile } = this.state;
    return (
      <div className="App">
        {isMobile ? <Header/> : <DesktopHeader/>}
        <Main/>
        {isMobile ? <Footer/> : null}
      </div>
    );
  }
}

export default withRouter(App);
