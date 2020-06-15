import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import {Link} from "react-router-dom";
import Placeholder from '../assets/placeholder.svg';
import { firebaseTimeToDateTimeString } from "../services/TimeService";

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

const ListCard = props => {
  const { classes, report } = props;
  return <Card className="card">
    <CardContent className={classes.allContent}>
      <CardMedia className="cardPicture"
                 image={report.data.mediaPaths && report.data.mediaPaths.length>0 ? report.data.mediaPaths[0] : Placeholder}
      />
      <CardContent className={classes.info}>
        <Typography variant={'h5'}>{report.data.species.toUpperCase()}</Typography>
        <Typography variant={'subtitle1'}>{firebaseTimeToDateTimeString(report.data.timestamp)}</Typography>
        <Typography style={{ color: 'grey' }}>{report.data.neighborhood ? report.data.neighborhood : "Unknown"}</Typography>
        <li>
          <Link to={`/reports/${report.id}&${report.data.isTacoma}`}>See Report</Link>
        </li>
      </CardContent>
    </CardContent>
  </Card>
};

export default withStyles(styles)(ListCard);
