import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import {Link} from "react-router-dom";
import Placeholder from '../assets/placeholder.svg';

const styles = theme => ({
  info: {
    flexDirection: 'column',
    flexGrow: 1,
    flex: 1,
    textAlign: 'left'
  },
  allContent: {
    display: 'flex',
    padding: 0
  }
});

/**
 * Get a string for a timestamp in the format that Cloud Firestore sends us.
 * Time should be an object with _nanoseconds and _seconds as fields.
 */
const timeToString = time => {
  if (time) {
    const date = new Date(time);
    return `${date.toDateString()} ${date.getHours()}:${date.getMinutes()}`;
  }
  return 'Unknown Time';
};

const ListCard = props => {
  const { classes, report } = props;
  return <Card className="card">
    <CardContent className={classes.allContent}>
      <CardMedia className="cardPicture"
                 image={report.data.mediaPaths && report.data.mediaPaths.length>0 ? report.data.mediaPaths[0] : Placeholder}
      />
      <CardContent className={classes.info}>
        <Typography variant={'h3'}>{report.data.species.toUpperCase()}</Typography>
        <Typography variant={'subtitle1'}>{timeToString(report.data.timestamp)}</Typography>
        <Typography style={{ color: 'grey' }}>{report.data.neighborhood ? report.data.neighborhood : "Unknown"}</Typography>
        <li>
          <Link to={`/reports/${report.id}`}>See Report</Link>
        </li>
      </CardContent>
    </CardContent>
  </Card>
};

export default withStyles(styles)(ListCard);
