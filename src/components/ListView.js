import React from 'react';
import ListCard from '../components/ListCard';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  container: {
    backgroundColor: 'grey',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  }
});

class ListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {reports: []}
  }

  componentDidMount() {
    fetch(process.env.REACT_APP_GET_REPORTS, {method: 'GET', headers: {'Content-Length': 0}})
      .then(response => response.json())
      .then(reports => {
        this.setState({...this.state, reports})
      })
      .catch(error => error);
  }

  render() {
    return (
    <div className={this.props.classes.container}>
    {
      this.state.reports
      ? this.state.reports.map((report) => <ListCard data={report.data} key={report.id}/>)
      : 'Loading...'
    }
    </div>
  )}
}

export default withStyles(styles)(ListView);
