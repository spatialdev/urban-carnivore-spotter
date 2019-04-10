import React from 'react';
import ListCard from '../components/ListCard';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  container: {
    backgroundColor: 'grey',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center'
  }
});

class ListView extends React.Component {

  state = {reports: null};

  componentDidMount() {
    axios.get(process.env.REACT_APP_GET_REPORTS)
      .then(reports => {
        this.setState({...this.state, reports: reports.data});
      })
      .catch(error => error);
  }

  render() {
    const {reports} = this.state;
    const {classes} = this.props;
    return (
    <div className={classes.container}>
    {
      reports
      ? reports.map((report) => <ListCard data={report.data} key={report.id}/>)
      : <CircularProgress className={classes.progress}/>
    }
    </div>
  )}
}

export default withStyles(styles)(ListView);
