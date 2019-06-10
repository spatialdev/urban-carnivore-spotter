import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import ListCard from '../components/ListCard';
import { dataMatchesFilter } from '../services/FilterService';
import FilterDrawer from './FilterDrawer';

const getReports = 'https://us-central1-seattlecarnivores-edca2.cloudfunctions.net/getReports';

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
    const { filter, isMobile } = this.props;
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
}
export default connect(mapStateToProps)(ListView);
