import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import ListCard from '../components/ListCard';
import { dataMatchesFilter } from '../services/FilterService';
import {withRouter} from "react-router-dom";
import Map from "@material-ui/icons/Place";
import FilterDrawer from './FilterDrawer';
import {withStyles} from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import * as ReactGA from "react-ga";

const getReports = 'https://us-central1-seattlecarnivores-edca2.cloudfunctions.net/getReports';

const styles = {
    mapViewButtonMobile: {
        '& svg': {
            fontSize: 20,
            backgroundColor: '#FECA00',
        },
        width: 20,
        height: 20,
        backgroundColor: '#FECA00',

    },
    mapViewButtonDesktop: {
        '& svg': {
            fontSize: 20,
            backgroundColor: '#FECA00'
        },
        width: 20,
        height: 20,
        backgroundColor: '#FECA00',
        color: '#FFFFFF'

    },
    mapViewButtonContainerMobile: {
        bottom: '20%',
        left: '80%',
        zIndex: 99,
        position: 'fixed',
        backgroundColor: '#FECA00',
        "&:hover": {
            backgroundColor: "#FECA00"
        },
        color: '#FFFFFF'
    },
    mapViewButtonContainerDesktop: {
        bottom: '20%',
        left: '93%',
        zIndex: 99,
        position: 'fixed',
        backgroundColor: '#FECA00',
        "&:hover": {
            backgroundColor: "#FECA00"
        }

    }
};

class ListView extends Component {
  state = {
    reports: null
  };

  componentDidMount() {
    ReactGA.pageview(window.location.pathname);
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
            <div >
                <Fab  className={isMobile? classes.mapViewButtonContainerMobile : classes.mapViewButtonContainerDesktop} aria-label="Toggle"  size="small">
                    <Map onClick={() => history.push('/')} className={isMobile? classes.mapViewButtonMobile : classes.mapViewButtonDesktop}/>
                </Fab>
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
