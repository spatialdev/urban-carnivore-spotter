import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import DesktopHeader from "./components/DesktopHeader";
import Header from './components/MobileHeader';
import Footer from './components/Footer';
import Main from './components/Main';
import { connect } from 'react-redux';
import { setMobile, updateAllNeighborhoods } from './store/actions';

import './App.css';

const ALL_NEIGHBORHOODS_ENDPOINT = 'https://us-central1-seattlecarnivores-edca2.cloudfunctions.net/getNeighborhoods';

class App extends Component {

  componentDidMount() {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);
    axios.get(ALL_NEIGHBORHOODS_ENDPOINT)
      .then(allNeighborhoods => updateAllNeighborhoods(allNeighborhoods.data));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkIfMobile);
  }

  checkIfMobile = () => {
    setMobile(window.innerWidth < 768);
  };

  render() {
    const {isMobile} = this.props;
    return (
      <div className="App">
        {isMobile ? <Header/> : <DesktopHeader/>}
        <Main/>
        {isMobile ? <Footer/> : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {isMobile: state.isMobile};
};

export default withRouter(connect(mapStateToProps)(App));
