import React, { Component } from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListCard from '../components/ListCard';

const styles = theme => ({
  container: {
    backgroundColor: '#D3D3D3',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center'
  }
});

const getReports = 'https://us-central1-seattlecarnivores-edca2.cloudfunctions.net/getReports';

class ListView extends Component {

  state = { reports: null };

  componentDidMount() {
    axios.get(getReports)
      .then(reports => {
        this.setState({ reports: reports.data });
      })
      .catch(error => error);
  }

  render() {
    const { reports } = this.state;
    const { classes } = this.props;
    if (!reports) {
      return <CircularProgress/>;
    }
    return (
      <div className={classes.container}>
        {reports.map((report) => <ListCard data={report.data} key={report.id}/>)}
      </div>
    )
  }
}

export default withStyles(styles)(ListView);
