import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { withRouter } from "react-router-dom";
import ReactPlayer from "react-player";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { CircularProgress } from "@material-ui/core";
import { KeyboardArrowLeft, NextWeekOutlined } from "@material-ui/icons";
import { jsDateToTimeString } from "../services/TimeService";
import Placeholder from "../assets/placeholder.svg";
import CardMedia from "@material-ui/core/CardMedia";
import { connect } from "react-redux";

const getReport =
  "https://us-central1-seattlecarnivores-edca2.cloudfunctions.net/getReport";
const getTacomaReport =
  "https://us-central1-seattlecarnivores-edca2.cloudfunctions.net/getTacomaReport";
const videoFormats = [".mov", ".mp4", ".webm", ".ogg", ".avi", ".wmv", ".mkv"];

class ReportViewer extends Component {
  state = {
    report: null,
    nextId: "",
    prevId: "",
  };

  componentDidMount() {
    const currIdx = this.getReportIdx(
      this.props.location.state.report.data.id,
      this.props.location.state.reports
    );

    const nextReportId = this.getNextId(
      currIdx,
      this.props.location.state.reports
    );

    console.log("NEXT REPORT ID", nextReportId);

    this.setState({
      report: this.props.location.state.report.data,
      nextId: nextReportId,
      // prevId: this.props.location.state.prevReport.id,
    });
  }

  componentWillReceiveProps() {
    const currIdx = this.getReportIdx(
      this.props.location.state.report.data.id,
      this.props.location.state.reports
    );

    const nextReportId = this.getNextId(
      currIdx,
      this.props.location.state.reports
    );

    this.setState({
      report: this.props.location.state.report.data,
      nextId: nextReportId,
      // prevId: this.props.location.state.prevReport.id,
    });

    console.log("curr idx", currIdx);
  }

  renderMediaItem(item) {
    return (
      <div className="image-gallery-image">
        {item.isVideo ? (
          <ReactPlayer url={item.original} controls width={400} height={200} />
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

  getReportIdx = (id, reports) => {
    let position = 0;
    reports.forEach((report, idx) => {
      if (report.id === id) {
        console.log("REPORT ID MATCH", report.id);
        position = idx;
      }
    });
    return position;
  };

  getNextId = (idx, reports) => {
    return reports[idx + 1].id;
  };

  getPrevId = (idx, reports) => {
    return reports[idx - 1].id;
  };

  render() {
    const { history, isMobile } = this.props;
    const { report, nextId, prevId } = this.state;

    if (!report) {
      return <CircularProgress />;
    }

    const isInTacoma =
      report.data !== undefined && report.data.isTacoma !== undefined
        ? report.data.isTacoma
        : false;
    const path =
      window.location.pathname.indexOf("tacoma") === -1
        ? "/reports"
        : "/tacoma/reports";

    console.log("this.props.location", this.props.location);

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
            <Button
              className="backToExplore"
              onClick={() => {
                history.push("/list");
              }}
            >
              {" "}
              <KeyboardArrowLeft />
              Back
            </Button>
          </div>
          <div>
            <Card className="reportCard">
              <div className="reportViewerTitle">
                <h4>
                  {report && report.species ? report.species.toUpperCase() : ""}
                </h4>
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

            {/* <ArrowBackIosIcon /> */}

            {/* <ArrowForwardIosIcon
              onClick={() =>
                history.push(
                  isInTacoma ? `${path}/tacoma/${nextId}` : `${path}/${nextId}`
                )
              }
            /> */}
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
