import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from "axios";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { CircularProgress, Toolbar } from "@material-ui/core";
import { KeyboardArrowLeft } from "@material-ui/icons";

import {jsDateToTimeString} from "../services/TimeService";

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

    if (report.mediaPaths !== undefined && report.mediaPaths.length > 0) {
      report.mediaPaths.map(med => {
        media.push({ original: med, thumbnail: med });
      })
    }

    //Need to replace with actual neighborhood once we have those polygons
    return (
      <div className="reportViewer">
        <Toolbar className="reportViewerToolbar">
          <Button className="backToExplore" onClick={() => history.goBack()}> <KeyboardArrowLeft/>Back</Button>
          <h4>{report.species.toUpperCase()}</h4>
        </Toolbar>
        <Card className="reportCard">
          {media ?
            <ImageGallery items={media}
                          showBullets={true} showIndex={false}
                          showThumbnails={false} showVideo={true}/> : null}
          <div style={{ backgroundColor: 'white', textAlign: 'left', paddingLeft: '30px'}}>
            <p><strong>Date:</strong> {new Date(report.timestamp).toDateString()}</p>
            <p><strong>Time of Sighting:</strong> {jsDateToTimeString(report.timestamp)}</p>
            <p><strong>Neighborhood:</strong> {report.neighborhood}</p>
            <p><strong>Confidence:</strong> {report.confidence}</p>
            <p style={{lineHeight:'.5'}}><strong>Number of Species:</strong></p>
            <p style={{lineHeight:'.5'}}><strong>Adult: </strong> {report.numberOfAdultSpecies}</p>
            <p style={{lineHeight:'.5'}}><strong>Young: </strong> {report.numberOfYoungSpecies}</p>
          </div>
        </Card>
      </div>
    );
  }
}

export default withRouter(ReportViewer);
