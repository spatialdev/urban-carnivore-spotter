import React, { Component } from 'react';
import axios from 'axios';

import CircularProgress from '@material-ui/core/CircularProgress';
import ListCard from '../components/ListCard';

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
    if (!reports) {
      return <CircularProgress/>;
    }
    return (
      <div className="cardContainer">
        {reports.map((report) => <ListCard data={report.data} key={report.id}/>)}
      </div>
    )
  }
}

export default ListView;
