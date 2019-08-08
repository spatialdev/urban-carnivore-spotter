import React from 'react';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { withStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
  thumbnail: {
    height: 100,
    width: 100,
    objectFit: 'contain',
    margin: 4,
  },
  filesDisplay: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  iconTextSpan: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  green: {
    color: '#93C838'
  },
  filesSelectedHeader: {
    color: '#3278BE',
    marginTop: 16,
    marginBottom: 16,
  },
  allContent: {
    margin: 16
  },
  icon: {
    marginRight: '8px'
  }
};

const MediaDisplay = (props) => {
  const { filesOnDeck, uploading, numUploadedFiles, removeFiles, classes } = props;
  return <div className={classes.allContent}>
    {filesOnDeck && filesOnDeck.length > 0 && !uploading ?
      <div>
        <div className={classes.filesDisplay}>
          {filesOnDeck.map((file, ind) =>
            <div key={ind}>
                <img className={classes.thumbnail}
                     alt={'Uploaded File'}
                     src={URL.createObjectURL(file)}/>
            </div>
          )}
        </div>
        <div className={classes.filesSelectedHeader}><strong>Files selected</strong></div>
        <span onClick={removeFiles} className={classes.iconTextSpan}><CancelOutlinedIcon fontSize='small' className={classes.icon}/> Remove files</span>
      </div>
      : null}
    {uploading ?
      <CircularProgress/>
      : null}
    {numUploadedFiles > 0 ?
      <span className={`${classes.iconTextSpan} ${classes.green}`}><CheckCircleOutlinedIcon fontSize='small' className={classes.icon}/>{numUploadedFiles} file(s) uploaded</span>
      : null}
  </div>
};

export default withStyles(styles)(MediaDisplay);
