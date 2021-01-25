import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import ReactPlayer from "react-player";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { CircularProgress } from "@material-ui/core";
import { jsDateToTimeString } from "../services/TimeService";
import Placeholder from "../assets/placeholder.svg";
import CardMedia from "@material-ui/core/CardMedia";
import { dataMatchesFilter } from "../services/FilterService";
import { setReports } from "../store/actions";
import { getReport } from "../services/ReportService";
import { getReports } from "../services/ReportsService";

const videoFormats = [".mov", ".mp4", ".webm", ".ogg", ".avi", ".wmv", ".mkv"];

const styles = {
  nav: {
    marginTop: "3.5em",
    marginBottom: "0.5em",
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
  staticMapWrapper: {
    display: 'flex',
    cursor: 'pointer',
  },
  staticMap: {
    flex: 1,
  }
};

class ReportViewer extends Component {
  state = {
    report: null,
    reports: null,
    nextId: "",
    prevId: "",
    isAtStartBoundary: false,
    isAtEndBoundary: false,
  };

  componentDidMount = async () => {
    const id = this.props.match.params.id;
    const currReport = await getReport(id);
    this.handleReports(currReport.data);
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      let report;
      const cachedReports = localStorage.getItem("reports");

      if (cachedReports) {
        const parsedReports = JSON.parse(cachedReports);
        report = parsedReports.filter(
          (report) => report.id === this.props.match.params.id
        )[0].data;
      } else if (this.props.reports) {
        report = this.props.reports.filter(
          (report) => report.id === this.props.match.params.id
        )[0].data;
      } else {
        report = this.state.reports.filter(
          (report) => report.id === this.props.match.params.id
        )[0].data;
      }

      this.handleReports(report);
    }
  };

  handleReports = async (data) => {
    let reports;
    const cachedReports = localStorage.getItem("reports");

    if (cachedReports) {
      const parsedReports = JSON.parse(cachedReports);
      reports = parsedReports;
    } else if (this.props.reports) {
      reports = this.props.reports;
    } else {
      reports = await getReports();
      setReports(reports);
    }

    const { id } = this.props.match.params;
    const filteredReports = this.filterReports(reports);

    const currIdx = this.getReportIdx(id, filteredReports);
    const nextReportId = this.getNextId(currIdx, filteredReports);
    const prevReportId = this.getPrevId(currIdx, filteredReports);

    this.setState({
      report: data,
      reports,
      nextId: nextReportId,
      prevId: prevReportId,
    });
  };

  filterReports = (reports) => {
    const { filter } = this.props;
    if (reports && reports.length > 0) {
      return reports
        .filter((report) => dataMatchesFilter(report, filter))
        .sort(
          (one, two) =>
            Date.parse(two.data.timestamp) - Date.parse(one.data.timestamp)
        );
    }
    return reports;
  };

  getReportIdx = (id, reports) => {
    let position = 0;
    if (reports && reports.length > 0) {
      reports.forEach((report, idx) => {
        if (report.id === id) {
          position = idx;
        }
      });
    }
    return position;
  };

  getNextId = (idx, reports) => {
    if (reports && reports.length > 0 && reports[idx + 1]) {
      this.setState({ isAtEndBoundary: false });
      return reports[idx + 1].id;
    }
    this.setState({ isAtEndBoundary: true });
    return reports[reports.length - 1].id;
  };

  getPrevId = (idx, reports) => {
    if (reports && reports.length > 0 && reports[idx - 1]) {
      this.setState({ isAtStartBoundary: false });
      return reports[idx - 1].id;
    }
    this.setState({ isAtStartBoundary: true });
    return reports[0].id;
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

  handleMapView = () => {
    const { history, match } = this.props;
    const { report } = this.state;
    const id = match.params.id;
    history.push({
      pathname: "/",
      state: { report: { id, data: report } },
    });
  };

  getStaticMap = () => {
    const { classes } = this.props;
    const { report } = this.state;
    const lat = report.mapLat;
    const lng = report.mapLng;

    let color;
    const currSpecies = report.species;
    if (currSpecies === "Red Fox") {
      color = "FE1513";
    } else if (currSpecies === "Black Bear") {
      color = "000000";
    } else if (currSpecies === "Bobcat") {
      color = "a30cfe";
    } else if (currSpecies === "Coyote") {
      color = "FECE17";
    } else if (currSpecies === "Cougar/Mountain Lion") {
      color = "2C9E0D";
    } else if (currSpecies === "Raccoon") {
      color = "FF1EC1";
    } else if (currSpecies === "Opossum") {
      color = "FE7901";
    } else if (currSpecies === "River Otter") {
      color = "171AB1";
    } else {
      color = "805b14";
    }

    let w = 350;
    let h = 200;
    const staticReportMap = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+${color}(${lng},${lat})/${lng},${lat},10,20/${w}x${h}?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`;
    return (
      <div
        className={classes.staticMapWrapper}
        onClick={this.handleMapView}
      >
        <img src={staticReportMap} className={classes.staticMap} />
      </div>
    );
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
    const { report, isAtEndBoundary, isAtStartBoundary } = this.state;

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
              {!isAtStartBoundary && (
                <>
                  <ArrowBackIosIcon className={classes.backNav} />
                  <div className={classes.navText}>Previous Report</div>
                </>
              )}
            </div>

            {!isAtEndBoundary && (
              <div className={classes.next} onClick={this.handleNext}>
                <div className={classes.navText}>Next Report</div>
                <ArrowForwardIosIcon className={classes.nextNav} />
              </div>
            )}
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
                {report.timestamp && (
                  <>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(report.timestamp).toDateString()}
                    </p>
                    <p>
                      <strong>Time of Sighting:</strong>{" "}
                      {jsDateToTimeString(report.timestamp)}
                    </p>
                  </>
                )}
                {report.neighborhood && (
                  <p>
                    <strong>Neighborhood:</strong> {report.neighborhood}
                  </p>
                )}
                {report.confidence && (
                  <p>
                    <strong>Confidence:</strong> {report.confidence}
                  </p>
                )}
                {(report.numberOfAdultSpecies ||
                  report.numberOfYoungSpecies) && (
                    <p style={{ lineHeight: ".5" }}>
                      <strong>Number of Species:</strong>
                    </p>
                  )}
                {report.numberOfAdultSpecies && (
                  <p style={{ lineHeight: ".5", marginLeft: "1em" }}>
                    <strong>Adult: </strong> {report.numberOfAdultSpecies}
                  </p>
                )}
                {report.numberOfYoungSpecies && (
                  <p style={{ lineHeight: ".5", marginLeft: "1em" }}>
                    <strong>Young: </strong> {report.numberOfYoungSpecies}
                  </p>
                )}
                {report.vantagePoint && (
                  <p>
                    <strong>Vantage Point:</strong> {report.vantagePoint}
                  </p>
                )}
              </div>
              {report.mapLat && report.mapLng && this.getStaticMap()}
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
