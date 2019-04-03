import React, { Component } from 'react';
import PropTypes from 'prop-types';

import firebase from 'firebase';
import FileUploader from 'react-firebase-file-uploader';

class Uploader extends Component {

  handleChangeImage = e => {
    const { target: { files } } = e;
    const { getMedia } = this.props;
    const filesToStore = [];

    for (let key in files) {
      let file = files[key];
      filesToStore.push(file);
    }

    getMedia(filesToStore, this.fileUploader);

  };

  handleUploadError = error => {
    console.error(error);
  };

  handleUploadSuccess = filename => {
    const { reference } = this.props;

    firebase
      .storage()
      .ref(reference)
      .child(filename)
      .getDownloadURL()
      .then(url => console.log(url));
  };

  render() {
    console.log(this.fileUploader);
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
