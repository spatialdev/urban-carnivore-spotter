import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import Placeholder from "../assets/placeholder.svg";
import { firebaseTimeToDateTimeString } from "../services/TimeService";
import { setReports } from "../store/actions";
import { getReports } from "../services/ReportsService";
import dateIcon from "../assets/Calendar.svg";
import locationIcon from "../assets/Location.svg";
import ReactPlayer from "react-player";
import CardMedia from "@material-ui/core/CardMedia";

const styles = {
  allContent: {
    display: "flex",
    width: "25em",
    height: "10em",
    fontFamily: "Raleway",
  },
  caption: {
    fontWeight: "bold",
  },
  reportLinkWrapper: {
    display: "flex",
    marginLeft: "1em",
  },
  viewReportButton: {
    height: "25px",
    width: "8em",
    backgroundColor: "#0877C6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontWeight: 500,
    marginTop: "0.55em",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#2d9ded",
      outline: "none",
    },
    "&:focus": {
      border: "1px solid #2d9ded",
      outline: "none",
    },
    "&:active": {
      border: "1px solid #2d9ded",
      outline: "none",
    },
  },
  image: {
    width: "10em",
    height: "10em",
  },
  title: {
    fontWeight: "bold",
    fontSize: "1.35em",
    marginLeft: "1em",
    marginBottom: "0.5em",
    marginTop: "0.25em",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  content: {
    display: "flex",
    fontSize: "1.1em",
    marginLeft: "1em",
    marginBottom: "0.3em",
  },
  contentText: {
    marginLeft: "0.25em",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    width: "10em",
  },
};

const videoFormats = [".mov", ".mp4", ".webm", ".ogg", ".avi", ".wmv", ".mkv"];

class PointTooltip extends Component {
  state = {
    isLoadingReport: false,
  };

  getReportViewer = async () => {
    this.setState({ isLoadingReport: true });
    const { report, history } = this.props;
    const { localStorage } = window;

    const isInTacoma =
      report.data !== undefined && report.data.isTacoma !== undefined
        ? report.data.isTacoma
        : false;
    const path =
      window.location.pathname.indexOf("tacoma") === -1
        ? "/reports"
        : "/tacoma/reports";

    const cachedReports = localStorage.getItem("reports");
    if (cachedReports) {
      const parsedReports = JSON.parse(cachedReports);
      setReports(parsedReports);
    } else {
      const reports = await getReports();
      setReports(reports);
      localStorage.setItem("reports", JSON.stringify(reports));
    }

    this.setState({ isLoadingReport: false });
    return isInTacoma
      ? history.push(`${path}/tacoma/${report.id}`)
      : history.push(`${path}/${report.id}`);
  };

  renderMedia = () => {
    const { classes, report } = this.props;
    let videoUrl;
    let imageUrl = Placeholder;
    let isVideo = false;

    if (report.data.mediaPaths && report.data.mediaPaths.length > 0) {
      const media = report.data.mediaPaths[0];
      const fileExtensionPattern = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gim;
      const extension = media.match(fileExtensionPattern);
      isVideo = videoFormats.includes(
        extension ? extension[0].toLowerCase() : false
      );

      if (isVideo) {
        videoUrl = media;
      } else {
        imageUrl = media;
      }
    }

    if (isVideo) {
      let w = 120;
      let h = 120;
      return (
        <ReactPlayer url={videoUrl} light={true} width={w} height={h} playing />
      );
    } else {
      return (
        <img
          className={classes.image}
          src={imageUrl}
          alt={report.data.species}
        />
      );
    }
  };

  render() {
    const { report, classes } = this.props;
    const { isLoadingReport } = this.state;

    return (
      <div className={classes.allContent}>
        {this.renderMedia()}
        <div className={classes.info}>
          <div className={classes.title}>{report.data.species}</div>
          <div className={classes.content}>
            <img className={classes.icon} src={dateIcon} alt="Date" />
            <div className={classes.contentText}>
              {firebaseTimeToDateTimeString(report.data.timestamp)}
            </div>
          </div>
          <div className={classes.content}>
            <img className={classes.icon} src={locationIcon} alt="Location" />
            <div className={classes.contentText}>
              {report.data.neighborhood}
            </div>
          </div>
          <div
            className={classes.reportLinkWrapper}
            style={{ cursor: "pointer" }}
            onClick={this.getReportViewer}
          >
            {isLoadingReport ? (
              <CircularProgress size="1.5em" />
            ) : (
              <button className={classes.viewReportButton}>View Report</button>
            )}
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
export default withRouter(
  connect(mapStateToProps)(withStyles(styles)(PointTooltip))
);
