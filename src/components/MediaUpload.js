import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AddIcon from '@material-ui/icons/Add';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import { withStyles } from '@material-ui/core/styles';
import Uploader from './Uploader';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
    border: 'dashed 2px gray',
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
});

class MediaUpload extends Component {
  getMedia = (dataFromChild, uploader) => {
    const { uploadMedia } = this.props;
    uploadMedia(dataFromChild, uploader);
  };

  getUploaderPaths = (paths) => {
    const { getMediaPaths } = this.props;
    getMediaPaths(paths);
  };

  render() {
    const { classes, setSpinner, getMediaPaths } = this.props;

    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={12}>
          <Grid container justify='center' spacing={16}>
            <Grid key={0} item>
              <Paper className='paper'>
                <label style={{ cursor: 'pointer' }}>
                  <CameraAltIcon />
                  <AddIcon />
                  <p>Photos</p>
                  <Uploader
                    acceptType='image/*'
                    reference='image'
                    getMedia={this.getMedia}
                    passPaths={getMediaPaths('image')}
                    setSpinner={setSpinner}
                  />
                </label>
              </Paper>
            </Grid>
            <Grid key={1} item>
              <Paper className='paper'>
                <label style={{ cursor: 'pointer' }}>
                  <PlayArrowIcon />
                  <AddIcon />
                  <p>Videos</p>
                  <Uploader
                    acceptType='video/*'
                    reference='videos'
                    getMedia={this.getMedia}
                    passPaths={getMediaPaths('video')}
                    setSpinner={setSpinner}
                  />
                </label>
              </Paper>
            </Grid>
            <Grid key={2} item>
              <Paper className='paper'>
                <label style={{ cursor: 'pointer' }}>
                  <VolumeUpIcon />
                  <AddIcon />
                  <p>Sound files</p>
                  <Uploader
                    acceptType='audio/*'
                    reference='audio'
                    getMedia={this.getMedia}
                    passPaths={getMediaPaths('audio')}
                    setSpinner={setSpinner}
                  />
                </label>
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
