import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";

import CircularProgress from "@material-ui/core/CircularProgress";
import Skeleton from "@material-ui/lab/Skeleton";
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
  skeleton: {
    display: "flex",
    flexDirection: "row",
    paddingTop: "100px",
    paddingBottom: "20px",
    minHeight: "100vh",
  },
  filterSkeleton: {
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    left: "5%",
    bottom: "5%",
    width: "250px",
    zIndex: 1000,
    height: "60%",
  },
  mainSkeleton: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5em",
    top: "-100px",
    marginBottom: "16px",
    marginLeft: "25em",
  },
  mainRectangle: {
    margin: "1em 0",
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
    const { itemsPerPage } = this.state;
    const cachedReports = localStorage.getItem("reports");

    if (cachedReports) {
      const parsedReports = JSON.parse(cachedReports);
      this.setState({
        reports: parsedReports,
        numOfPages: Math.floor(parsedReports.length / itemsPerPage),
      });
    } else {
      ReactGA.pageview(window.location.pathname);
      axios
        .get(getReports)
        .then((reports) => {
          this.setState({
            reports: reports.data,
            numOfPages: Math.floor(reports.data.length / itemsPerPage),
          });
          localStorage.setItem("reports", JSON.stringify(reports.data));
        })
        .catch((error) => error);
    }

    const cachedPageNum = localStorage.getItem("lastPageNum");
    if (cachedPageNum) {
      this.setState({ pageNumber: cachedPageNum });
    }
  }

  timeToNanos = (timestamp) =>
    timestamp._nanoseconds + timestamp._seconds * 1000000000;

  handlePageNumber = (e, page) => {
    this.setState({ pageNumber: page });

    const cachedPageNum = localStorage.getItem("lastPageNum");
    if (cachedPageNum) {
      window.localStorage.removeItem("lastPageNum");
      localStorage.setItem("lastPageNum", page);
    } else {
      localStorage.setItem("lastPageNum", page);
    }
  };

  renderMainSkeleton = () => {
    const { classes } = this.props;
    const numOfSkeletons = 10;
    const skeletons = [];

    for (let i = 0; i < numOfSkeletons; i++) {
      skeletons.push(
        <Skeleton
          className={classes.mainRectangle}
          variant="rect"
          width={800}
          height={200}
        />
      );
    }

    return skeletons;
  };

  render() {
    const { reports, pageNumber, itemsPerPage, numOfPages } = this.state;
    const { filter, isMobile, history, classes } = this.props;

    if (!reports) {
      if (isMobile) {
        return <CircularProgress />;
      }
      return (
        <div className={classes.skeleton}>
          <div className={classes.filterSkeleton}>
            <Skeleton variant="rect" width={247} height={493} />
          </div>
          <div className={classes.mainSkeleton}>
            {this.renderMainSkeleton()}
          </div>
        </div>
      );
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
              pageNumber * itemsPerPage,
              pageNumber * itemsPerPage + itemsPerPage
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
          page={Number(pageNumber)}
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
