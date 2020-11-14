import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { CircularProgress } from "@material-ui/core";
import { KeyboardArrowLeft } from "@material-ui/icons";

import { jsDateToTimeString } from "../services/TimeService";

import Placeholder from "../assets/placeholder.svg";
import CardMedia from "@material-ui/core/CardMedia";
import { connect } from "react-redux";
import * as ReactGA from "react-ga";

const getReport =
  "https://us-central1-seattlecarnivores-edca2.cloudfunctions.net/getReport";
const getTacomaReport =
  "https://us-central1-seattlecarnivores-edca2.cloudfunctions.net/getTacomaReport";
const videoFormats = [".mov", ".mp4", ".webm", ".ogg", ".avi", ".wmv", ".mkv"];

class ReportViewer extends Component {
  state = {
    report: null,
  };

  componentDidMount() {
    ReactGA.pageview(window.location.pathname);
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const path = window.location.pathname.includes("/reports/tacoma")
      ? getTacomaReport
      : getReport;
    axios
      .get(path + `?id=${id}`)
      .then((report) => {
        this.setState({ report: report.data });
      })
      .catch((error) => error);
  }

  renderMediaItem(item) {
    return (
      <div className="image-gallery-image">
        {item.isVideo ? (
          <video width="100%" controls autoPlay>
            <source src={item.original} />
          </video>
        ) : (
          <img
            src={item.original}
            alt={item.originalAlt}
            srcSet={item.srcSet}
            sizes={item.sizes}
            title={item.originalTitle}
            style={{ width: "400px" }}
          />
        )}

        {item.description && (
          <span className="image-gallery-description">{item.description}</span>
        )}
      </div>
    );
  }

  render() {
    const { history, isMobile } = this.props;
    const { report } = this.state;

    if (!report) {
      return <CircularProgress />;
    }

    let media = [];

    if (report.mediaPaths !== undefined && report.mediaPaths.length > 0) {
      report.mediaPaths.map((med) => {
        const fileExtensionPattern = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gim;
        const extension = med.match(fileExtensionPattern)[0];
        const isVideo = videoFormats.includes(extension.toLowerCase());
        media.push({
          original: med,
          thumbnail: med,
          isVideo: isVideo,
          ext: extension,
        });
      });
    }

    return (
      <div className={isMobile ? "reportViewerMobile" : "reportViewerDesktop"}>
        <div className="buttonAndCardContainer">
          <div className="backToExploreContainer">
            <Button className="backToExplore" onClick={() => history.goBack()}>
              {" "}
              <KeyboardArrowLeft />
              Back
            </Button>
          </div>
          <div>
            <Card className="reportCard">
              <div className="reportViewerTitle">
                <h4>{report.species.toUpperCase()}</h4>
              </div>
              {media.length > 0 ? (
                media.map((mediaItem) => this.renderMediaItem(mediaItem))
              ) : (
                <CardMedia
                  className="reportPlaceHolderImage"
                  image={Placeholder}
                />
              )}
              <div
                style={{
                  backgroundColor: "white",
                  textAlign: "left",
                  paddingLeft: "30px",
                }}
              >
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(report.timestamp).toDateString()}
                </p>
                <p>
                  <strong>Time of Sighting:</strong>{" "}
                  {jsDateToTimeString(report.timestamp)}
                </p>
                <p>
                  <strong>Neighborhood:</strong> {report.neighborhood}
                </p>
                <p>
                  <strong>Confidence:</strong> {report.confidence}
                </p>
                <p style={{ lineHeight: ".5" }}>
                  <strong>Number of Species:</strong>
                </p>
                <p style={{ lineHeight: ".5" }}>
                  <strong>Adult: </strong> {report.numberOfAdultSpecies}
                </p>
                <p style={{ lineHeight: ".5" }}>
                  <strong>Young: </strong> {report.numberOfYoungSpecies}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isMobile: state.isMobile,
  };
};
export default withRouter(connect(mapStateToProps)(ReportViewer));
