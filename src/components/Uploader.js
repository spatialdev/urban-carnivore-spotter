import React, { Component } from 'react';
import PropTypes from 'prop-types';

import firebase from 'firebase';
import FileUploader from 'react-firebase-file-uploader';

class Uploader extends Component {
  state = {
    isUploading: false,
  };

  handleUploadStart = () => {
    this.setState({ isUploading: true });
  };


  handleUploadError = error => {
    this.setState({ isUploading: false });
    console.error(error);
  };

  handleUploadSuccess = filename => {
    const { reference } = this.props;

    this.setState({ isUploading: false });

    firebase
      .storage()
      .ref(reference)
      .child(filename)
      .getDownloadURL()
      .then(url => console.log(url));
  };

  render() {
    const { acceptType, reference } = this.props;

    return (
      <div>
        <FileUploader
          style={{display: 'none'}}
          accept={acceptType}
          name="avatar"
          randomizeFilename
          storageRef={firebase.storage().ref(reference)}
          onUploadStart={this.handleUploadStart}
          onUploadError={this.handleUploadError}
          onUploadSuccess={this.handleUploadSuccess}
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