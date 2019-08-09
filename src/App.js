import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import DesktopHeader from "./components/DesktopHeader";
import Header from './components/MobileHeader';
import Footer from './components/Footer';
import Main from './components/Main';
import { connect } from 'react-redux';
import { setMobile, updateAllNeighborhoods} from './store/actions';
import NeighborhoodService from './services/NeighborhoodService';
import * as ReactGA from 'react-ga';

import './App.css';

const trackingId = process.env.REACT_APP_GA_TRACKING_ID;

class App extends Component {

  componentDidMount() {
    // Initialize Google Analytics
    ReactGA.initialize(trackingId);
    ReactGA.pageview(window.location.pathname);
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);
    NeighborhoodService.getAllNeighborhoods()
      .then(allNeighborhoods => updateAllNeighborhoods(allNeighborhoods));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkIfMobile);
  }

  checkIfMobile = () => {
    setMobile(window.innerWidth < 768);
  };

  render() {
    const {isMobile, history} = this.props;
    // If we are on the mobile create reports page, show nothing. Otherwise, show either the mobile header or the
    // desktop header.
    const header = isMobile && history.location.pathname === '/reports/create' ? null : isMobile ? <Header/> : <DesktopHeader/>;
    // If we are on mobile, and not on the create reports page, show a footer.
    const footer = isMobile && history.location.pathname !== '/reports/create' ? <Footer/> : null;
    return (
      <div className="App">
        {header}
        <Main/>
        {footer}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {isMobile: state.isMobile};
};

export default withRouter(connect(mapStateToProps)(App));
