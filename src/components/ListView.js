import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import ListCard from '../components/ListCard';
import { dataMatchesFilter } from '../services/FilterService';
import {withRouter} from "react-router-dom";
import List from "@material-ui/icons/List";
import {withStyles} from "@material-ui/core";

const getReports = 'https://us-central1-seattlecarnivores-edca2.cloudfunctions.net/getReports';


const styles = {
  filterContainer: {
    backgroundColor: 'white',
    position: 'fixed',
    left: '5%',
    top: '15%',
    width: 250,
    zIndex: 1,
    height: '60%',
    boxShadow: '2px 2px 2px'
  },
  toggleContainer:{
    top: '50%',
    left: '80%',
    position:'fixed'
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

  render() {
    const { reports } = this.state;
    const { filter,history } = this.props;
    if (!reports) {
      return <CircularProgress/>;
    }
    return (
        <div>

          <div className="cardContainer" >
            {reports.filter(report => dataMatchesFilter(report, filter))
                .map((report) => <ListCard data={report.data} key={report.id}/>)}
            <List onClick={() => history.push('/')} className="listMapToggle"/>
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
export default withRouter(connect(mapStateToProps)(withStyles(styles)(ListView)));
