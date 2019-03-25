import React, { Component } from 'react';

import Main from './components/Main';
import Footer from './components/Footer';

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
    this.setState({ isMobile: window.innerWidth < 600 });
  };

  render() {
    const { isMobile } = this.state;
    return (
      <div className="App">
        <Main/>
        {isMobile ? <Footer/> : null}
      </div>
    );
  }
}

export default App;
