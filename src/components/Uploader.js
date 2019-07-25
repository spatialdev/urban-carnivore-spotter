import React, { Component } from 'react';
import PropTypes from 'prop-types';

import firebase from 'firebase';
import FileUploader from 'react-firebase-file-uploader';
import imageCompression from 'browser-image-compression';

class Uploader extends Component {
  state = {
    mediaPaths: [],
  };

  handleChangeImage = e => {
    const { target: { files } } = e;
    const { getMedia, acceptType, setSpinner } = this.props;
    setSpinner(true);
    if (acceptType === "images/*") {
      Promise.all(Array.from(files).map(file => imageCompression(file, {maxSizeMB: .5})))
        .then(files => {
          getMedia(files, this.fileUploader);
          setSpinner(false);
        })
        .catch(error => {
          console.log(error);
          setSpinner(false);
        });
    } else {
      getMedia(Array.from(files), this.fileUploader);
      setSpinner(false);
    }

  };

  handleUploadError = error => {
    console.error(error);
  };

  handleUploadSuccess = async filename => {
    const { passPaths, reference } = this.props;
    const { mediaPaths } = this.state;
    await firebase
      .storage()
      .ref(reference)
      .child(filename)
      .getDownloadURL()
      .then(url => mediaPaths.push(url));

    passPaths(mediaPaths);

  };

  render() {
    const { acceptType, reference } = this.props;
    return (
      <div>
        <FileUploader
          style={{ display: 'none' }}
          accept={acceptType}
          multiple
          randomizeFilename
          storageRef={firebase.storage().ref(reference)}
          onChange={this.handleChangeImage}
          onUploadError={this.handleUploadError}
          onUploadSuccess={this.handleUploadSuccess}
          ref={instance => this.fileUploader = instance}
        />
      </div>
    );
  }
}

Uploader.propTypes = {
  acceptType: PropTypes.string.isRequired,
  reference: PropTypes.string.isRequired
};

export default Uploader;
