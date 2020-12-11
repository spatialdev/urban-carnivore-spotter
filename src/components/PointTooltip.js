import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import { KeyboardArrowRight } from "@material-ui/icons";
import { CircularProgress } from "@material-ui/core";
import Placeholder from "../assets/placeholder.svg";
import { firebaseTimeToDateTimeString } from "../services/TimeService";
import { setReports } from "../store/actions";
import { getReport } from "../services/ReportService";
import { getReports } from "../services/ReportsService";

const styles = {
  allContent: {
    display: "flex",
    height: 80,
  },
  caption: {
    fontWeight: "bold",
  },
  reportLink: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    margin: "1em",
  },
  image: {
    maxWidth: 40,
    maxHeight: 40,
    margin: 4,
  },
};

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

  render() {
    const { report, classes } = this.props;
    const { isLoadingReport } = this.state;

    return (
      <div className={classes.allContent}>
        <img
          className={classes.image}
          src={
            report.data.mediaPaths && report.data.mediaPaths.length > 0
              ? report.data.mediaPaths[0]
              : Placeholder
          }
          alt=""
        />
        <div className={classes.info}>
          <div>
            <strong>{report.data.species}</strong>
          </div>
          <div>
            <strong>Date & Time:</strong>
          </div>
          <div>{firebaseTimeToDateTimeString(report.data.timestamp)}</div>
          <div>
            <strong>Location:</strong> {report.data.neighborhood}
          </div>
        </div>
        <div
          className={classes.reportLink}
          style={{ cursor: "pointer" }}
          onClick={this.getReportViewer}
        >
          {isLoadingReport ? (
            <CircularProgress size="1.5em" />
          ) : (
            <KeyboardArrowRight />
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(PointTooltip));
