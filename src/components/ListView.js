import React, { Component } from "react";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import Skeleton from "@material-ui/lab/Skeleton";
import Pagination from "@material-ui/lab/Pagination";
import ListCard from "../components/ListCard";
import { dataMatchesFilter } from "../services/FilterService";
import { withRouter } from "react-router-dom";
import Map from "@material-ui/icons/Place";
import mapViewIcon from "../assets/MapView.svg";
import FilterDrawer from "./FilterDrawer";
import { withStyles } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import * as ReactGA from "react-ga";
import { setReports, setReport } from "../store/actions";
import { getReports, updateReports } from "../services/ReportsService";
import { getReport } from "../services/ReportService";
import NeighborhoodService from "../services/NeighborhoodService";
const neighborhoodService = new NeighborhoodService();

const styles = {
  mapViewButtonContainerMobile: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bottom: "75%",
    left: "88%",
    zIndex: 99,
    position: "sticky",
    backgroundColor: "#0877C6",
    color: "#FFFFFF",
    cursor: "pointer",
    border: 0,
    outline: 0,
    borderRadius: "100%",
    padding: "1em",
    "&:hover": {
      backgroundColor: "#319ce8",
    },
    "&:active": {
      backgroundColor: "#319ce8",
    },
    "&:focus": {
      backgroundColor: "#319ce8",
    },
  },
  mapViewButtonContainerDesktop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bottom: "75%",
    left: "88%",
    zIndex: 99,
    position: "sticky",
    backgroundColor: "#000",
    color: "#FFFFFF",
    cursor: "pointer",
    border: 0,
    outline: 0,
    borderRadius: "19.5px",
    width: "9em",
    height: "40px",
    "&:hover": {
      backgroundColor: "rgba(25,1,1,0.7)",
    },
    "&:active": {
      backgroundColor: "rgba(25,1,1,0.7)",
    },
    "&:focus": {
      backgroundColor: "rgba(25,1,1,0.7)",
    },
  },
  mapViewText: {
    marginRight: "0.5em",
    marginLeft: "0.2em",
    fontWeight: 600,
    fontSize: "1em",
  },
  mapViewIcon: {
    marginRight: "0.2em",
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
    boxShadow: "0px 2px 10px 0px rgba(117,117,117,0.05)",
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
    marginLeft: "20em",
  },
  mainRectangle: {
    margin: "1em 0",
  },
  filterContainer: {
    backgroundColor: "white",
    position: "fixed",
    left: "5%",
    bottom: "5%",
    width: 250,
    zIndex: 1000,
    height: "60%",
    boxShadow: "0px 2px 10px 0px rgba(117,117,117,0.05)",
    borderRadius: "6px",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: "0.25em",
      height: "0.25em",
    },
    "&::-webkit-scrollbar-track": {
      width: "0.25em",
      height: "0.25em",
      backgroundColor: "#F1F1F1",
    },
    "&::-webkit-scrollbar-corner": {
      width: "0.25em",
      height: "0.25em",
      backgroundColor: "#F1F1F1",
    },
    "&::-webkit-scrollbar-thumb": {
      width: "0.25em",
      height: "0.25em",
      backgroundColor: "#D8D8D8",
    },
  },
};

class ListView extends Component {
  state = {
    reports: null,
    pageNumber: 1,
    itemsPerPage: 10,
  };

  componentDidMount = async () => {
    ReactGA.pageview(window.location.pathname);
    const { localStorage } = window;

    const cachedReports = localStorage.getItem("reports");
    if (cachedReports) {
      const parsedReports = JSON.parse(cachedReports);
      this.setState({ reports: parsedReports });
    } else {
      const reports = await getReports();
      setReports(reports);
      this.setState({ reports });
      localStorage.setItem("reports", JSON.stringify(reports));
    }

    // Temporary: updates all reports' neighborhoods in DB
    // JSON.parse(cachedReports).forEach(async (report) => {
    //   if (
    //     report.data.neighborhood === "Seattle" ||
    //     report.data.neighborhood === "Unknown"
    //   ) {
    //     const newNeighborhood = await neighborhoodService.getNeighborhoodFor(
    //       report.data.mapLat,
    //       report.data.mapLng
    //     );
    //     if (newNeighborhood !== "Unknown") {
    //       await updateReports(report.id, {
    //         neighborhood: newNeighborhood,
    //       });
    //     } else {
    //       await updateReports(report.id, {
    //         neighborhood: "Washington",
    //       });
    //     }
    //   }
    // });

    const cachedPageNum = localStorage.getItem("lastPageNum");
    if (cachedPageNum) {
      this.setState({ pageNumber: cachedPageNum });
    }
  };

  timeToNanos = (timestamp) =>
    timestamp._nanoseconds + timestamp._seconds * 1000000000;

  handlePageNumber = (e, page) => {
    const { localStorage } = window;
    this.setState({ pageNumber: page });

    const cachedPageNum = localStorage.getItem("lastPageNum");
    if (cachedPageNum) {
      localStorage.removeItem("lastPageNum");
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
          key={`${i}-rectangle`}
          className={classes.mainRectangle}
          variant="rect"
          width={800}
          height={200}
        />
      );
    }

    return skeletons;
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

  renderReportsPerPage = (reports) => {
    const { pageNumber, itemsPerPage } = this.state;
    return reports && reports.length > 10
      ? reports
          .slice(
            pageNumber * itemsPerPage,
            pageNumber * itemsPerPage + itemsPerPage
          )
          .map((report) => {
            return (
              <ListCard
                key={report.id}
                currReport={report}
                handleReport={this.handleReport}
              />
            );
          })
      : reports.map((report) => {
          return (
            <ListCard
              key={report.id}
              currReport={report}
              handleReport={this.handleReport}
            />
          );
        });
  };

  handleReport = async (id) => {
    const { localStorage } = window;
    const cachedReport = localStorage.getItem("report");

    if (cachedReport) {
      localStorage.removeItem("report");
    }

    const report = await getReport(id);
    setReport({ report });
    localStorage.setItem("report", JSON.stringify(report));
    this.showReportPage(report, id);
  };

  showReportPage = (report, id) => {
    const { history } = this.props;

    const isInTacoma =
      report.data !== undefined && report.data.isTacoma !== undefined
        ? report.data.isTacoma
        : false;
    const path =
      window.location.pathname.indexOf("tacoma") === -1
        ? "/reports"
        : "/tacoma/reports";

    history.push(isInTacoma ? `${path}/tacoma/${id}` : `${path}/${id}`);
  };

  getCurrReport = async (id) => {
    const { localStorage } = window;

    const cachedReport = localStorage.getItem("report");
    if (cachedReport) {
      localStorage.removeItem("report");
    }
    const report = await getReport(id);
    setReport(report);
    localStorage.setItem("report", JSON.stringify(report));
  };

  render() {
    const { reports, pageNumber, itemsPerPage } = this.state;
    const { isMobile, history, classes } = this.props;

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
    const filteredReports = this.filterReports(reports);

    return (
      <div className="backgroundCardContainer">
        {isMobile ? null : (
          <div className={classes.filterContainer}>
            <FilterDrawer />
          </div>
        )}
        <div className="cardContainer">
          {this.renderReportsPerPage(filteredReports)}
          <button
            onClick={() =>
              history.location.pathname.indexOf("tacoma") === -1
                ? history.push("/")
                : history.push("/tacoma")
            }
            className={
              isMobile
                ? classes.mapViewButtonContainerMobile
                : classes.mapViewButtonContainerDesktop
            }
          >
            {!isMobile && <div className={classes.mapViewText}>Map View</div>}
            <img
              className={classes.mapViewIcon}
              src={mapViewIcon}
              alt="Map View"
            />
          </button>
        </div>
        <Pagination
          classes={{ ul: classes.paginator }}
          color="primary"
          onChange={this.handlePageNumber}
          count={Math.floor(filteredReports.length / itemsPerPage)}
          page={Number(pageNumber)}
          showFirstButton
          showLastButton
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isMobile: state.isMobile,
    filter: state.filter,
    reports: state.reports,
  };
};
export default withRouter(
  connect(mapStateToProps)(withStyles(styles)(ListView))
);
