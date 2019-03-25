import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AddIcon from '@material-ui/icons/Add';
import CameraAltIcon from '@material-ui/icons/CameraAlt'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
    border: 'dashed 2px gray'
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
});


class MediaUpload extends Component {


  render() {
    const { classes } = this.props;

    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={16}>
              <Grid key={0} item>
                <Paper className="paper">
                  <CameraAltIcon/>
                  <AddIcon/>
                  <p>Photos</p>
                </Paper>
              </Grid>
            <Grid key={1} item>
              <Paper className="paper">
                <PlayArrowIcon/>
                <AddIcon/>
                <p>Videos</p>
              </Paper>
            </Grid>
            <Grid key={2} item>
              <Paper className="paper">
                <VolumeUpIcon/>
                <AddIcon/>
                <p>Sound files</p>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

MediaUpload.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MediaUpload);