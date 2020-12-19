import React, { Component } from "react";
import ReactMapboxGl, {
  Layer,
  Feature,
  Popup,
  ZoomControl,
} from "react-mapbox-gl";
import axios from "axios";
import PointTooltip from "../components/PointTooltip";
import FilterDrawer from "./FilterDrawer";
import { withStyles } from "@material-ui/core/styles";
import { CircularProgress } from "@material-ui/core";
import { connect } from "react-redux";
import { getReports } from "../services/ReportsService";
import { dataMatchesFilter } from "../services/FilterService";
import NavigationIcon from "@material-ui/icons/Navigation";
import Fab from "@material-ui/core/Fab";
import List from "@material-ui/icons/List";
import Help from "@material-ui/icons/HelpOutline";
import { withRouter } from "react-router-dom";
import { speciesColorMap } from "../services/ColorService";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import * as ReactGA from "react-ga";
import supported from "@mapbox/mapbox-gl-supported";
import legendIcon from "../assets/Legend.svg";
import { setReports } from "../store/actions";

let Map2 = null;
if (supported({})) {
  Map2 = ReactMapboxGl({
    accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
  });
}

const getReportsUrl =
  "https://us-central1-seattlecarnivores-edca2.cloudfunctions.net/getReports";
const styles = {
  filterContainer: {
    backgroundColor: "white",
    position: "fixed",
    left: "5%",
    bottom: "5%",
    width: 250,
    zIndex: 1000,
    height: "60%",
    boxShadow: "0px 2px 10px 0px rgba(117,117,117,0.3)",
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
  buttonContainerMobile: {
    left: "87%",
    position: "fixed",
    bottom: "25%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  buttonContainerDesktop: {
    right: "3%",
    position: "fixed",
    bottom: "5vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  legendMobileContainer: {
    top: "24vh",
    left: "87%",
    position: "fixed",
    boxShadow: "0px 2px 10px 0px rgba(117,117,117,0.3)",
  },
  legendDesktopContainer: {
    textAlign: "right",
    margin: "2.5em",
    marginTop: "0.5em",
    marginRight: "3.5em",
  },
  legendButtonMobile: {
    "& svg": {
      fontSize: 20,
    },
    width: 20,
    height: 20,
    backgroundColor: "#FFFFFF",
  },
  navigationButton: {
    "& svg": {
      fontSize: 20,
    },
    width: 20,
    height: 20,
    backgroundColor: "#FFFFFF",
  },
  navigationButtonContainer: {
    width: 35,
    height: 35,
    backgroundColor: "#FFFFFF",
    "&:hover": {
      backgroundColor: "#FFFFFF",
    },
    boxShadow: "0px 2px 10px 0px rgba(117,117,117,0.3)",
  },
  listViewButton: {
    "& svg": {
      fontSize: 20,
    },
    width: 20,
    height: 20,
    backgroundColor: "#FFFFFF",
  },
  fab: {
    margin: 1,
    backgroundColor: "#FFFFFF",
    boxShadow: "0px 2px 10px 0px rgba(117,117,117,0.3)",
  },
  extendedIcon: {
    height: "0.8em",
    width: "0.8em",
  },
  listViewMobileWrapper: {
    top: "15vh",
    left: "87%",
    position: "fixed",
    backgroundColor: "#FFFFFF",
    "& svg": {
      fontSize: 20,
    },
    boxShadow: "0px 2px 10px 0px rgba(117,117,117,0.3)",
  },
  listViewDesktopWrapper: {
    textAlign: "right",
    margin: "2.5em",
    marginTop: "0.5em",
    marginRight: "3.5em",

    "& svg": {
      fontSize: 30,
    },
  },
  reportLinkCloseButtonWrapper: {
    height: "100%",
    display: "flex",
    justifyContent: "space-around",
    borderRadius: "4px",
  },
  closeIcon: {
    height: "15px",
    width: "15px",
    margin: "0.25em",
  },
  addReportWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "3em",
  },
  reportSightingButton: {
    display: "flex",
    flexDirection: "row",
    textTransform: "capitalize",
    fontFamily: "Raleway",
    height: "40px",
    borderRadius: "24px",
    boxShadow: "0px 2px 10px 0px rgba(117,117,117,0.3)",
  },
  reportSightingText: {
    marginRight: "10px",
    marginLeft: "5px",
    fontWeight: 600,
    letterSpacing: "0.5px",
  },
  addReportIcon: {
    height: "0.8em",
    width: "0.8em",
  },
  buttonText: {
    textTransform: "capitalize",
    fontFamily: "Raleway",
    marginRight: "10px",
    marginLeft: "5px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    color: "rgba(2,2,30,0.7)",
  },
};
class MapView extends Component {
  state = {
    viewport: {
      center:
        window.location.pathname.indexOf("tacoma") === -1
          ? [-122.335167, 47.608013]
          : [-122.522997, 47.3049119],
      zoom: [10],
    },
    popupInfo: null,
    reports: null,
    legend: false,
    isLoadingReport: false,
  };

  componentDidMount() {
    ReactGA.pageview(window.location.pathname);
    const url = getReportsUrl + "?mapLat=47.608013&mapLng=-122.335167";
    axios
      .get(url)
      .then((reports) => {
        this.setState({ reports: reports.data });
      })
      .catch((error) => error);

    this.handleListCardPopup();
  }

  handleListCardPopup = () => {
    const { action, location } = this.props.history;
    if (
      action &&
      action === "PUSH" &&
      location &&
      location.state &&
      location.state.report
    ) {
      this.handlePopUpInfo(location.state.report);
      this.renderPopup();
    }
  };

  onMoveEnd = (map) => {
    const center = map.getCenter();
    const zoom = map.getZoom();
    this.setState({
      viewport: { center: [center.lng, center.lat], zoom: [zoom] },
    });
    const url =
      getReportsUrl + "?mapLat=" + center.lat + "&mapLng=" + center.lng;
    axios
      .get(url)
      .then((reports) => {
        reports.data !== "No data!"
          ? this.setState({ reports: reports.data })
          : this.setState({ reports: null });
      })
      .catch((error) => error);
  };

  renderPopup() {
    const { popupInfo } = this.state;
    const { classes } = this.props;
    if (popupInfo) {
      return (
        <Popup
          coordinates={[popupInfo.data.mapLng, popupInfo.data.mapLat]}
          anchor={"bottom"}
        >
          <div className={classes.reportLinkCloseButtonWrapper}>
            <PointTooltip report={popupInfo} />
            <CloseIcon
              style={{ cursor: "pointer" }}
              className={classes.closeIcon}
              onClick={() => this.setState({ popupInfo: false })}
            />
          </div>
        </Popup>
      );
    }
  }

  handleClose = () => {
    const { history } = this.props;
    this.setState({ legend: false }, () => {
      history.push("/");
    });
  };

  showLegend = () => {
    return speciesColorMap.entrySeq().map(([key, value]) => (
      <div key={key}>
        <span style={{ background: value }} className="dot"></span>
        <label key={key} className="label">
          {" "}
          {key}{" "}
        </label>
      </div>
    ));
  };

  updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            viewport: {
              center: [position.coords.longitude, position.coords.latitude],
              zoom: [10],
            },
          });
        },
        (err) => console.log(err)
      );
    } else {
      this.setState({
        viewport: {
          center:
            window.location.pathname.indexOf("tacoma") === -1
              ? [-122.354291, 47.668733]
              : [-122.522997, 47.3049119],
          zoom: [10],
        },
      });
    }
  };

  showReportSightings = (isMobile, classes, history) => {
    if (!isMobile) {
      return (
        <Button
          variant="contained"
          color="primary"
          className={classes.reportSightingButton}
          onClick={() =>
            history.location.pathname.indexOf("tacoma") !== -1
              ? history.push("/tacoma/reports/create")
              : history.push("/reports/create")
          }
        >
          <div className={classes.reportSightingText}>Report Sighting</div>
          <AddIcon className={classes.addReportIcon} />
        </Button>
      );
    }
  };

  showListViewButton = (isMobile, classes, history) => {
    let isTacoma = history.location.pathname.indexOf("tacoma") !== -1;
    const { isLoadingReport } = this.state;
    return isMobile ? (
      <Fab
        className={classes.listViewMobileWrapper}
        aria-label="Toggle"
        size="small"
        onClick={() =>
          isTacoma ? history.push("/tacoma/list") : history.push("/list")
        }
      >
        <List className={classes.listViewButton} />
      </Fab>
    ) : (
      <div className={classes.listViewDesktopWrapper}>
        <Fab
          variant="extended"
          aria-label="Toggle"
          className={classes.fab}
          size="medium"
          onClick={this.getListViewReports}
        >
          <div className={classes.buttonText}>List View</div>
          {isLoadingReport ? (
            <CircularProgress size="1.5em" />
          ) : (
            <List className={classes.extendedIcon} />
          )}
        </Fab>
      </div>
    );
  };

  getListViewReports = async () => {
    this.setState({ isLoadingReport: true });
    const { history } = this.props;
    const { localStorage } = window;

    let isTacoma = history.location.pathname.indexOf("tacoma") !== -1;
    const cachedReports = localStorage.getItem("reports");

    if (cachedReports) {
      localStorage.removeItem("reports");
    }
    const reports = await getReports();
    setReports(reports);
    localStorage.setItem("reports", JSON.stringify(reports));

    this.setState({ isLoadingReport: false });
    return isTacoma ? history.push("/tacoma/list") : history.push("/list");
  };

  showLegendButton = (isMobile, classes) => {
    return isMobile ? (
      <Fab
        className={classes.legendMobileContainer}
        aria-label="Legend"
        size="small"
        onClick={() => this.setState({ legend: true })}
      >
        <img src={legendIcon} alt="Legend" />
      </Fab>
    ) : (
      <div className={classes.legendDesktopContainer}>
        <Fab
          variant="extended"
          className={classes.fab}
          size="medium"
          aria-label="Legend"
          onClick={() => this.setState({ legend: true })}
        >
          <div className={classes.buttonText}>Legend</div>
          <img src={legendIcon} alt="Legend" />
        </Fab>
      </div>
    );
  };

  handlePopUpInfo = (report) => {
    this.setState({ popupInfo: report });
  };

  render() {
    const { classes, isMobile, filter, history } = this.props;
    const { reports, legend, viewport } = this.state;
    let reportMapPoints;
    const cachedReports = localStorage.getItem("reports");
    if (cachedReports) {
      const parsedReports = JSON.parse(cachedReports);
      reportMapPoints = parsedReports;
    } else {
      reportMapPoints = reports;
    }

    return (
      <div className="mapContainer">
        {!isMobile && (
          <div className={classes.filterContainer}>
            <FilterDrawer />
          </div>
        )}
        {Map2 && (
          <Map2
            style="mapbox://styles/mapbox/streets-v9"
            className="map"
            center={viewport.center}
            zoom={viewport.zoom}
            onMoveEnd={(e) => this.onMoveEnd(e)}
          >
            {this.renderPopup()}
            <Layer
              type="circle"
              id="report-marker"
              paint={{
                "circle-radius": 7,
                "circle-stroke-width": 0.3,
                "circle-stroke-opacity": 1,
                "circle-color": [
                  "match",
                  ["get", "species"],
                  "Red Fox",
                  "#FE1513",
                  "Black Bear",
                  "#000000",
                  "Bobcat",
                  "#a30cfe",
                  "Coyote",
                  "#FECE17",
                  "Cougar/Mountain Lion",
                  "#2C9E0D",
                  "Raccoon",
                  "#FF1EC1",
                  "Opossum",
                  "#FE7901",
                  "River Otter",
                  "#171AB1",
                  "Other/Unknown",
                  "#805b14",
                  "#e2dcc6",
                ],
              }}
            >
              {reportMapPoints
                ? reportMapPoints
                    .filter((report) => dataMatchesFilter(report, filter))
                    .map((report) => (
                      <Feature
                        key={report.id}
                        coordinates={[report.data.mapLng, report.data.mapLat]}
                        properties={report.data}
                        onClick={() => this.handlePopUpInfo(report)}
                      />
                    ))
                : null}
            </Layer>
            <div className={classes.addReportWrapper}>
              {this.showReportSightings(isMobile, classes, history)}
            </div>
            <div
              className={
                isMobile
                  ? classes.buttonContainerMobile
                  : classes.buttonContainerDesktop
              }
            >
              <div>
                <Fab
                  className={classes.navigationButtonContainer}
                  aria-label="Navigation"
                  size="small"
                >
                  <NavigationIcon
                    className={classes.navigationButton}
                    onClick={() => this.updateLocation()}
                  />
                </Fab>
              </div>
              <div>
                <ZoomControl
                  position="bottom-right"
                  style={{
                    position: "relative",
                    zIndex: 10,
                    flexDirection: "column",
                    boxShadow: "0px 2px 10px 0px rgba(117,117,117,0.3)",
                    border: "none",
                    bottom: "0px",
                    right: "0px",
                    top: "auto",
                    left: "auto",
                    margin: ".5rem",
                    marginTop: "3rem",
                    display: "flex",
                  }}
                />
              </div>
            </div>
            {this.showListViewButton(isMobile, classes, history)}
            {this.showLegendButton(isMobile, classes)}
            {legend && (
              <div className={legend ? "legend-open" : "legend-close"}>
                <CloseIcon
                  style={{ cursor: "pointer" }}
                  className="legend-close"
                  onClick={this.handleClose}
                />
                <div className="two-col-special">{this.showLegend()}</div>
              </div>
            )}
          </Map2>
        )}
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
  connect(mapStateToProps)(withStyles(styles)(MapView))
);
