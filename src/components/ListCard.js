import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ReactPlayer from "react-player";
import Card from "@material-ui/core/Card";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Placeholder from "../assets/placeholder.svg";
import { firebaseTimeToDateTimeString } from "../services/TimeService";
import dateIcon from "../assets/Calendar.svg";
import locationIcon from "../assets/Location.svg";

const styles = () => ({
  info: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    flexGrow: 1,
    flex: 1,
    textAlign: "left",
    marginLeft: "1em",
  },
  allContent: {
    display: "flex",
    padding: 0,
  },
  snapshotGenerator: {
    display: "block",
    height: "1px",
    left: 0,
    objectFit: "contain",
    position: "fixed",
    top: 0,
    width: "1px",
    zIndex: -1,
  },
  seeReport: {
    display: "flex",
    justifyContent: "center",
    cursor: "pointer",
    height: "25px",
    width: "122px",
    borderRadius: "4px",
    backgroundColor: "#F6F4F3",
    padding: "0.15em",
    marginTop: "0.75rem",
    "&:hover": {
      backgroundColor: "#ebe7e4",
    },
    "&:active": {
      backgroundColor: "#ebe7e4",
    },
    "&:focus": {
      backgroundColor: "#ebe7e4",
    },
  },
  seeReportMobile: {
    display: "flex",
    justifyContent: "center",
    cursor: "pointer",
    height: "15px",
    width: "100px",
    borderRadius: "4px",
    backgroundColor: "#F6F4F3",
    padding: "0.1em",
    marginTop: "0.5rem",
    "&:hover": {
      backgroundColor: "#ebe7e4",
    },
    "&:active": {
      backgroundColor: "#ebe7e4",
    },
    "&:focus": {
      backgroundColor: "#ebe7e4",
    },
  },
  seeReportText: {
    textAlign: "center",
    fontWeight: "bold",
    paddingTop: "0.1em",
  },
  seeReportTextMobile: {
    fontSize: "0.75em",
    padding: 0,
    margin: 0,
  },
  title: {
    marginBottom: "0.75rem",
    fontFamily: "Raleway",
    color: "rgba(57,57,57,0.95)",
    fontWeight: "bold",
    fontSize: "1.25em",
    letterSpacing: "0.56px",
  },
  titleMobile: {
    fontSize: "0.9em",
    fontWeight: "bold",
    padding: 0,
    margin: 0,
    marginBottom: "0.5rem",
  },
  date: {
    display: "flex",
    marginBottom: "0.5rem",
    fontFamily: "Raleway",
    color: "rgba(57,57,57,0.95)",
    letterSpacing: "0.44px",
    fontSize: "0.9em",
    fontWeight: 600,
  },
  dateMobile: {
    fontSize: "0.75em",
    padding: 0,
    margin: 0,
  },
  location: {
    display: "flex",
    marginBottom: "0.75rem",
    fontFamily: "Raleway",
    color: "#757575",
    letterSpacing: "0.44px",
    fontSize: "0.9em",
    fontWeight: 500,
  },
  locationMobile: {
    fontSize: "0.75em",
    padding: 0,
    margin: 0,
  },
  icon: {
    marginRight: "0.5em",
  },
  staticMap: {
    cursor: "pointer",
  },
  staticMapMobile: {
    height: "100px",
    width: "100px",
  },
});

const videoFormats = [".mov", ".mp4", ".webm", ".ogg", ".avi", ".wmv", ".mkv"];

class ListCard extends Component {
  handleMapView = () => {
    const { history, currReport } = this.props;
    history.push({
      pathname: "/",
      state: { report: currReport },
    });
  };

  getStaticMap = () => {
    const { classes, currReport, isMobile } = this.props;
    const lat = currReport.data.mapLat;
    const lng = currReport.data.mapLng;

    let color;
    const currSpecies = currReport.data.species;
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

    let w = !isMobile ? 200 : 100;
    let h = !isMobile ? 200 : 150;
    const staticReportMap = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+${color}(${lng},${lat})/${lng},${lat},10,20/${w}x${h}?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`;
    return (
      <div
        className={!isMobile ? classes.staticMap : classes.staticMapMobile}
        onClick={this.handleMapView}
      >
        <img src={staticReportMap} />
      </div>
    );
  };

  renderMedia = () => {
    const { currReport, isMobile } = this.props;
    let videoUrl;
    let imageUrl = Placeholder;
    let isVideo = false;

    if (currReport.data.mediaPaths && currReport.data.mediaPaths.length > 0) {
      const media = currReport.data.mediaPaths[0];
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
      let w = !isMobile ? 200 : 100;
      let h = !isMobile ? 200 : 150;
      return (
        <ReactPlayer url={videoUrl} light={true} width={w} height={h} playing />
      );
    } else {
      if (isMobile && imageUrl === Placeholder) {
        return this.getStaticMap();
      } else {
        return <CardMedia className="cardPicture" image={imageUrl} />;
      }
    }
  };

  render() {
    const { classes, handleReport, currReport, isMobile } = this.props;
    return (
      <Card className="card">
        <CardContent className={classes.allContent}>
          {this.renderMedia()}
          <CardContent className={classes.info}>
            <Typography
              className={!isMobile ? classes.title : classes.titleMobile}
              variant={"h5"}
            >
              {currReport.data.species}
            </Typography>
            <Typography
              variant={"subtitle1"}
              className={!isMobile ? classes.date : classes.dateMobile}
            >
              <img className={classes.icon} src={dateIcon} alt="Date" />
              {firebaseTimeToDateTimeString(currReport.data.timestamp)}
            </Typography>
            <Typography
              style={{ color: "grey" }}
              className={!isMobile ? classes.location : classes.locationMobile}
            >
              <img className={classes.icon} src={locationIcon} alt="Location" />
              {currReport.data.neighborhood
                ? currReport.data.neighborhood
                : "Washington"}
            </Typography>
            <div
              className={
                !isMobile ? classes.seeReport : classes.seeReportMobile
              }
              onClick={() => handleReport(currReport.id)}
            >
              <div
                className={
                  !isMobile
                    ? classes.seeReportText
                    : classes.seeReportTextMobile
                }
              >
                See Report
              </div>
              {!isMobile && <ChevronRightIcon />}
            </div>
          </CardContent>
          {!isMobile && this.getStaticMap()}
        </CardContent>
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isMobile: state.isMobile,
  };
};
export default withRouter(
  connect(mapStateToProps)(withStyles(styles)(ListCard))
);
