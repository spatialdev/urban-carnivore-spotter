import React, { Component } from 'react';
import PropTypes from 'prop-types';

import firebase from 'firebase';
import FileUploader from 'react-firebase-file-uploader';

class Uploader extends Component {
  state = {
    mediaPaths: [],
  };

  handleChangeImage = e => {
    const { target: { files } } = e;
    const { getMedia } = this.props;
    const filesToStore = [];
    Array.from(files).forEach(file => filesToStore.push(file));

    getMedia(filesToStore, this.fileUploader);

  };

  handleUploadError = error => {
    console.error(error);
  };

  handleUploadSuccess = async filename => {
    const { passPaths } = this.props;
    const { mediaPaths } = this.state;
    await firebase
      .storage()
      .ref('images')
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
