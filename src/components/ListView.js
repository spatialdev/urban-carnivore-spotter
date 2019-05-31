import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import ListCard from '../components/ListCard';
import { dataMatchesFilter } from '../services/FilterService';

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

  render() {
    const { reports } = this.state;
    const { filter } = this.props;
    if (!reports) {
      return <CircularProgress/>;
    }
    return (
      <div className="backgroundCardContainer">
        <div className="cardContainer">
          {reports.filter(report => dataMatchesFilter(report, filter))
            .map((report) => <ListCard data={report.data} key={report.id}/>)}
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
