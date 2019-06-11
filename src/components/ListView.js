import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import ListCard from '../components/ListCard';
import { dataMatchesFilter } from '../services/FilterService';
import {withRouter} from "react-router-dom";
import Map from "@material-ui/icons/Map";
import FilterDrawer from './FilterDrawer';
import {withStyles} from "@material-ui/core";

const getReports = 'https://us-central1-seattlecarnivores-edca2.cloudfunctions.net/getReports';

const styles = {
    toggleButtonMobile: {
        bottom: '20%',
        left: '88%',
        zIndex: 99,
        position: 'fixed',
    },

    toggleButtonDesktop: {
        left:'95%',
        zIndex: 99,
        position: 'fixed',
        bottom: '20%'
    }
};

class ListView extends Component {
  state = {
    reports: null
  };

  componentDidMount() {
    axios.get(getReports)
      .then(reports => {
        this.setState({ reports: reports.data });
      })
      .catch(error => error);
  }

  timeToNanos = (timestamp) => timestamp._nanoseconds + (timestamp._seconds * 1000000000);

  render() {
    const { reports } = this.state;
    const { filter, isMobile, history, classes } = this.props;
    if (!reports) {
      return <CircularProgress/>;
    }
    return (
      <div className="backgroundCardContainer">
        { isMobile ? null :
          <div className="filterContainer">
            <FilterDrawer />
          </div>
        }
        <div className="cardContainer">
          {reports.filter(report => dataMatchesFilter(report, filter))
            .sort((one, two) => {
                return this.timeToNanos(two.data.time_submitted) - this.timeToNanos(one.data.time_submitted);
            })
            .map((report) => <ListCard report={report} key={report.id}/>)}
            <div>
                <Map onClick={() => history.push('/')} className={isMobile? classes.toggleButtonMobile : classes.toggleButtonDesktop}/>
            </div>
        </div>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
      isMobile: state.isMobile,
      filter: state.filter
  };
};
export default withRouter(connect(mapStateToProps)(withStyles(styles)(ListView)));
