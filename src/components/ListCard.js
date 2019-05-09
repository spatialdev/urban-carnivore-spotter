import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

// TODO find something better
const DEFAULT_IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/2010-brown-bear.jpg/200px-2010-brown-bear.jpg";

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
  const date = new Date(time);
  return `${date.toDateString()} ${date.getHours()}:${date.getMinutes()}`;
};

const ListCard = props => {
  const { classes, data } = props;
  return <Card className="card">
    <CardContent className={classes.allContent}>
      <CardMedia className="cardPicture"
                 image={data.image_url ? data.image_url : DEFAULT_IMAGE_URL}
      />
      <CardContent className={classes.info}>
        <Typography variant={'h3'}>{data.species.toUpperCase()}</Typography>
        <Typography variant={'subtitle1'}>{timeToString(data.timestamp)}</Typography>
        <Typography style={{ color: 'grey' }}>{data.mapLat},{data.mapLng}</Typography>
      </CardContent>
    </CardContent>
  </Card>
};

export default withStyles(styles)(ListCard);
