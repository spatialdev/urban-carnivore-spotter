import React, { Component } from "react";
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
  },
  seeReportText: {
    textAlign: "center",
    fontWeight: "bold",
    paddingTop: "0.1em",
  },
  title: {
    marginBottom: "0.75rem",
    fontFamily: "Raleway",
    color: "rgba(57,57,57,0.95)",
    fontWeight: "bold",
    fontSize: "1.25em",
    letterSpacing: "0.56px",
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
  location: {
    display: "flex",
    marginBottom: "0.75rem",
    fontFamily: "Raleway",
    color: "#757575",
    letterSpacing: "0.44px",
    fontSize: "0.9em",
    fontWeight: 500,
  },
  icon: {
    marginRight: "0.5em",
  },
  staticMap: {
    cursor: "pointer",
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

  render() {
    const { classes, handleReport, currReport } = this.props;
    const lat = currReport.data.mapLat;
    const lng = currReport.data.mapLng;

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

    console.log("curr rep", currReport);
    return (
      <Card className="card">
        <CardContent className={classes.allContent}>
          {isVideo ? (
            <ReactPlayer
              url={videoUrl}
              light={true}
              width={200}
              height={200}
              playing
            />
          ) : (
            <CardMedia className="cardPicture" image={imageUrl} />
          )}
          <CardContent className={classes.info}>
            <Typography className={classes.title} variant={"h5"}>
              {currReport.data.species}
            </Typography>
            <Typography variant={"subtitle1"} className={classes.date}>
              <img className={classes.icon} src={dateIcon} alt="Date" />
              {firebaseTimeToDateTimeString(currReport.data.timestamp)}
            </Typography>
            <Typography style={{ color: "grey" }} className={classes.location}>
              <img className={classes.icon} src={locationIcon} alt="Location" />
              {currReport.data.neighborhood
                ? currReport.data.neighborhood
                : "Washington"}
            </Typography>
            <div
              className={classes.seeReport}
              onClick={() => handleReport(currReport.id)}
            >
              <div className={classes.seeReportText}>See Report</div>
              <ChevronRightIcon />
            </div>
          </CardContent>
          <div className={classes.staticMap} onClick={this.handleMapView}>
            <img
              src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+${color}(${lng},${lat})/${lng},${lat},10,20/200x200?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
            />
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default withRouter(withStyles(styles)(ListCard));
