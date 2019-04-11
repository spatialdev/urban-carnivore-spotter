import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

// TODO find something better
const DEFAULT_IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/2010-brown-bear.jpg/200px-2010-brown-bear.jpg";

const styles = theme => ({
  picture: {
    width: 150,
    height: 150
  },
  info: {
    flexDirection: 'column',
    flexGrow: 1,
    flex: 1,
    textAlign: 'left'
  },
  card: {
    marginBottom: 16,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 16,
    height: 150,
    maxWidth: 500,
    minWidth: 500
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
  const nanosInMillis = time._nanoseconds / 1000000;
  const secondsInMillis = time._seconds * 1000;
  return new Date(nanosInMillis + secondsInMillis).toLocaleString();
}

/**
 * Get a string representing a timestamp in the format that Cloud Firestore sends us.
 * Should be something we can call toString on, falsy, or an object with _longitude and
 * _latitude as fields.
 * TODO: once we handle neighborhoods properly, we should return a string representing
 * the neighborhood here.
 */
const locationToString = location => {
  if (!location) {
    return "No location provided";
  }
  if (location._longitude && location._latitude) {
    return `${location._longitude} ${location._longitude}`;
  }
  return location.toString();
}

const ListCard = props => {
  const { classes, data } = props;
  return <Card className={classes.card}>
    <CardContent className={classes.allContent}>
      <CardMedia className={classes.picture}
                 image={data.image_url ? data.image_url : DEFAULT_IMAGE_URL}
      />
      <CardContent className={classes.info}>
        <Typography variant={'h3'}>{data.species.toUpperCase()}</Typography>
        <Typography variant={'subtitle1'}>{timeToString(data.time_seen)}</Typography>
        <Typography variant={'subtitle1'}>{locationToString(data.location)}</Typography>
      </CardContent>
    </CardContent>
  </Card>
};

export default withStyles(styles)(ListCard);
