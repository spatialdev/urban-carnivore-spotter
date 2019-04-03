import React, { Component } from 'react';
import PropTypes from 'prop-types';

import firebase from 'firebase';
import FileUploader from 'react-firebase-file-uploader';

class Uploader extends Component {
  state = {
    paths: [],
  };

  handleChangeImage = e => {
    const { target: { files } } = e;
    const { getMedia } = this.props;
    const { paths } = this.state;
    const filesToStore = [];

    for (let key in files) {
      let file = files[key];
      filesToStore.push(file);
    }

    getMedia(filesToStore, this.fileUploader, paths);

  };

  handleUploadError = error => {
    console.error(error);
  };

  handleUploadSuccess = filename => {
    const { reference } = this.props;
    const { paths } = this.state;

    firebase
      .storage()
      .ref(reference)
      .child(filename)
      .getDownloadURL()
      .then(url => paths.push(url));
  };

  render() {
    const { acceptType, reference } = this.props;

    return (
      <div>
        <FileUploader
          style={{ display: 'none' }}
          accept={acceptType}
          name="avatar"
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
