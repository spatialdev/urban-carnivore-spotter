import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";

import CircularProgress from "@material-ui/core/CircularProgress";
import Pagination from "@material-ui/lab/Pagination";
import ListCard from "../components/ListCard";
import { dataMatchesFilter } from "../services/FilterService";
import { withRouter } from "react-router-dom";
import Map from "@material-ui/icons/Place";
import FilterDrawer from "./FilterDrawer";
import { withStyles } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import * as ReactGA from "react-ga";

const getReports =
  "https://us-central1-seattlecarnivores-edca2.cloudfunctions.net/getReports";

const styles = {
  mapViewButtonMobile: {
    "& svg": {
      fontSize: 20,
      backgroundColor: "#FECA00",
    },
    width: 20,
    height: 20,
    backgroundColor: "#FECA00",
  },
  mapViewButtonDesktop: {
    "& svg": {
      fontSize: 20,
      backgroundColor: "#FECA00",
    },
    width: 20,
    height: 20,
    backgroundColor: "#FECA00",
    color: "#FFFFFF",
  },
  mapViewButtonContainerMobile: {
    bottom: "20%",
    left: "80%",
    zIndex: 99,
    position: "fixed",
    backgroundColor: "#FECA00",
    "&:hover": {
      backgroundColor: "#FECA00",
    },
    color: "#FFFFFF",
  },
  mapViewButtonContainerDesktop: {
    bottom: "20%",
    left: "93%",
    zIndex: 99,
    position: "fixed",
    backgroundColor: "#FECA00",
    "&:hover": {
      backgroundColor: "#FECA00",
    },
  },
  paginator: {
    justifyContent: "center",
    padding: "1em",
  },
};

class ListView extends Component {
  state = {
    reports: null,
    pageNumber: 1,
    itemsPerPage: 10,
    numOfPages: 0,
  };

  componentDidMount() {
    const { localStorage } = window;
    const cachedReports = localStorage.getItem("reports");

    if (cachedReports) {
      this.setState({ reports: JSON.parse(cachedReports) });
    } else {
      const { itemsPerPage } = this.state;
      ReactGA.pageview(window.location.pathname);
      axios
        .get(getReports)
        .then((reports) => {
          this.setState({
            reports: reports.data,
            numOfPages: Math.ceil(reports.data.length / itemsPerPage),
          });
          localStorage.setItem("reports", JSON.stringify(reports.data));
        })
        .catch((error) => error);
    }
  }

  timeToNanos = (timestamp) =>
    timestamp._nanoseconds + timestamp._seconds * 1000000000;

  handlePageNumber = (e, page) => {
    this.setState({ pageNumber: page });
  };

  render() {
    const { reports, pageNumber, itemsPerPage, numOfPages } = this.state;
    const { filter, isMobile, history, classes } = this.props;

    console.log("REPORTS IN LIST VIEW", reports);

    if (!reports) {
      return <CircularProgress />;
    }
    return (
      <div className="backgroundCardContainer">
        {isMobile ? null : (
          <div className="filterContainer">
            <FilterDrawer />
          </div>
        )}
        <div className="cardContainer">
          {reports
            .slice(
              (pageNumber - 1) * itemsPerPage,
              pageNumber * (itemsPerPage - 1)
            )
            .filter((report) => dataMatchesFilter(report, filter))
            .sort((one, two) => {
              return (
                this.timeToNanos(two.data.time_submitted) -
                this.timeToNanos(one.data.time_submitted)
              );
            })
            .map((report) => (
              <ListCard report={report} key={report.id} />
            ))}
          <div>
            <Fab
              className={
                isMobile
                  ? classes.mapViewButtonContainerMobile
                  : classes.mapViewButtonContainerDesktop
              }
              aria-label="Toggle"
              size="small"
            >
              <Map
                onClick={() =>
                  history.location.pathname.indexOf("tacoma") === -1
                    ? history.push("/")
                    : history.push("/tacoma")
                }
                className={
                  isMobile
                    ? classes.mapViewButtonMobile
                    : classes.mapViewButtonDesktop
                }
              />
            </Fab>
          </div>
        </div>
        <Pagination
          classes={{ ul: classes.paginator }}
          onChange={this.handlePageNumber}
          count={numOfPages}
          page={pageNumber}
          size="large"
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isMobile: state.isMobile,
    filter: state.filter,
  };
};
export default withRouter(
  connect(mapStateToProps)(withStyles(styles)(ListView))
);
