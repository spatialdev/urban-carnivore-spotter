import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { withRouter } from "react-router-dom";
import ReactPlayer from "react-player";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { CircularProgress } from "@material-ui/core";
import { KeyboardArrowLeft, NextWeekOutlined } from "@material-ui/icons";
import { jsDateToTimeString } from "../services/TimeService";
import Placeholder from "../assets/placeholder.svg";
import CardMedia from "@material-ui/core/CardMedia";
import { dataMatchesFilter } from "../services/FilterService";

const videoFormats = [".mov", ".mp4", ".webm", ".ogg", ".avi", ".wmv", ".mkv"];

const styles = {
  nav: {
    marginTop: "3.5em",
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    cursor: "pointer",
  },
  prev: {
    display: "flex",
    alignItems: "center",
  },
  next: {
    display: "flex",
    alignItems: "center",
  },
  navText: {
    textAlign: "center",
    fontSize: "0.9em",
    color: "black",
  },
  backNav: { width: "15px", height: "15px", color: "black" },
  nextNav: {
    marginLeft: "0.25em",
    width: "15px",
    height: "15px",
    color: "black",
  },
};

class ReportViewer extends Component {
  state = {
    report: null,
    nextId: "",
    prevId: "",
  };

  componentDidMount = async () => {
    const { data } = this.props.report.report;
    this.handleReports(data);
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      const report = this.props.reports.filter(
        (report) => report.id === this.props.match.params.id
      )[0].data;
      this.handleReports(report);
    }
  };

  handleReports = (data) => {
    const { reports } = this.props;
    const { id } = this.props.match.params;
    const filteredReports = this.filterReports(reports);

    const currIdx = this.getReportIdx(id, filteredReports);
    const nextReportId = this.getNextId(currIdx, filteredReports);
    const prevReportId = this.getPrevId(currIdx, filteredReports);

    this.setState({
      report: data,
      nextId: nextReportId,
      prevId: prevReportId,
    });
  };

  filterReports = (reports) => {
    const { filter } = this.props;
    return reports
      .filter((report) => dataMatchesFilter(report, filter))
      .sort((one, two) => {
        return (
          this.timeToNanos(two.data.time_submitted) -
          this.timeToNanos(one.data.time_submitted)
        );
      });
  };

  timeToNanos = (timestamp) =>
    timestamp._nanoseconds + timestamp._seconds * 1000000000;

  getReportIdx = (id, reports) => {
    let position = 0;
    reports.forEach((report, idx) => {
      if (report.id === id) {
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

  handleNext = () => {
    const { history } = this.props;
    const { report, nextId } = this.state;

    const isInTacoma =
      report.data !== undefined && report.data.isTacoma !== undefined
        ? report.data.isTacoma
        : false;
    const path =
      window.location.pathname.indexOf("tacoma") === -1
        ? "/reports"
        : "/tacoma/reports";

    history.push(isInTacoma ? `${path}/tacoma/${nextId}` : `${path}/${nextId}`);
  };

  handlePrevious = () => {
    const { history } = this.props;
    const { report, prevId } = this.state;

    const isInTacoma =
      report.data !== undefined && report.data.isTacoma !== undefined
        ? report.data.isTacoma
        : false;
    const path =
      window.location.pathname.indexOf("tacoma") === -1
        ? "/reports"
        : "/tacoma/reports";

    history.push(isInTacoma ? `${path}/tacoma/${prevId}` : `${path}/${prevId}`);
  };

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

  render() {
    const { history, isMobile, classes } = this.props;
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
            <Button
              className="backToExplore"
              onClick={() => {
                history.push("/list");
              }}
            >
              Back to List
            </Button>
          </div>
          <div className={classes.nav}>
            <div className={classes.prev} onClick={this.handlePrevious}>
              <ArrowBackIosIcon className={classes.backNav} />
              <div className={classes.navText}>Previous Report</div>
            </div>

            <div className={classes.next} onClick={this.handleNext}>
              <div className={classes.navText}>Next Report</div>
              <ArrowForwardIosIcon className={classes.nextNav} />
            </div>
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
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isMobile: state.isMobile,
    report: state.report,
    reports: state.reports,
    filter: state.filter,
  };
};
export default withRouter(
  connect(mapStateToProps)(withStyles(styles)(ReportViewer))
);
