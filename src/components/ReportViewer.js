import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from "axios";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { CircularProgress, Toolbar } from "@material-ui/core";
import { KeyboardArrowLeft } from "@material-ui/icons";

import ImageGallery from 'react-image-gallery';

const getReport = 'https://us-central1-seattlecarnivores-edca2.cloudfunctions.net/getReport';

class ReportViewer extends Component {
  state = {
    report: null,
  };

  componentDidMount() {
    const { match: { params: { id } } } = this.props;

    axios.get(getReport + `?id=${id}`)
      .then(report => {
        this.setState({ report: report.data });
      })
      .catch(error => error);
  }

  render() {
    const { history } = this.props;
    const { report } = this.state;

    if (!report) {
      return <CircularProgress/>
    }

    const date = new Date(report.timestamp);
    let media = [];

    if (report.mediaPaths.length > 0) {
      report.media.map(med => {
        media.push({ original: med, thumbnail: med });
      })
    }

    //Need to replace with actual neighborhood once we have those polygons
    return (
      <div className="reportViewer">
        <Toolbar className="reportViewerToolbar">
          <Button className="backToExplore" onClick={() => history.push('/')}> <KeyboardArrowLeft/>Explore</Button>
          <h4>{report.species.toUpperCase()}</h4>
        </Toolbar>
        <Card className="reportCard">
          {report.media ?
            <ImageGallery items={media}
                          showBullets={true} showIndex={true}
                          showThumbnails={false} showVideo={true}/> : null}
          <div style={{ backgroundColor: 'white', textAlign: 'left', paddingLeft: '30px' }}>
            <p><strong>Date:</strong> {new Date(report.timestamp).toDateString()}</p>
            <p><strong>Time of Sighting:</strong> {date.getHours()}:{date.getMinutes()}</p>
            <p><strong>Neighborhood:</strong> NEIGHBORHOOD HERE</p>
            <p><strong>Confidence:</strong> {report.confidence}</p>
          </div>
        </Card>
      </div>
    );
  }
}

export default withRouter(ReportViewer);