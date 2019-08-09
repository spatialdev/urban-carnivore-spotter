import {Component} from 'react';
import { withRouter } from 'react-router-dom';

/**
 * Thanks to https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/guides/scroll-restoration.md
 * for the hints on automatically scrolling to the top of a page on navigation.
 */
class ScrollToTop extends Component {
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0,0);
    }
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(ScrollToTop);
