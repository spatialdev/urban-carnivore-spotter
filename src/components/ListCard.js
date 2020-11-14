import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Placeholder from "../assets/placeholder.svg";
import { firebaseTimeToDateTimeString } from "../services/TimeService";
import VideoThumbnail from "react-video-thumbnail";

const styles = (theme) => ({
  info: {
    flexDirection: "column",
    flexGrow: 1,
    flex: 1,
    textAlign: "left",
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
});

const videoFormats = [".mov", ".mp4", ".webm", ".ogg", ".avi", ".wmv", ".mkv"];

const ListCard = (props) => {
  const { classes, report } = props;
  const isInTacoma =
    report.data !== undefined && report.data.isTacoma !== undefined
      ? report.data.isTacoma
      : false;
  const path =
    window.location.pathname.indexOf("tacoma") === -1
      ? "/reports"
      : "/tacoma/reports";

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

  return (
    <Card className="card">
      <CardContent className={classes.allContent}>
        {/* TODO: paginate/virtualize the list and video thumb will actually show without exceeding stack limit */}
        {isVideo ? (
          // <VideoThumbnail
          //   videoUrl={videoUrl}
          //   width={200}
          //   height={200}
          //   renderThumbnail={true}
          //   snapshotAtTime={5}
          //   cors={true}
          // />
          <CardMedia className="cardPicture" image={imageUrl} />
        ) : (
          // <video width="200px" height="200px" muted autoplay={false}>
          //   <source src={videoUrl} />
          // </video>
          <CardMedia className="cardPicture" image={imageUrl} />
        )}

        <CardContent className={classes.info}>
          <Typography variant={"h5"}>
            {report.data.species.toUpperCase()}
          </Typography>
          <Typography variant={"subtitle1"}>
            {firebaseTimeToDateTimeString(report.data.timestamp)}
          </Typography>
          <Typography style={{ color: "grey" }}>
            {report.data.neighborhood ? report.data.neighborhood : "Unknown"}
          </Typography>
          <li>
            <Link
              to={
                isInTacoma
                  ? `${path}/tacoma/${report.id}`
                  : `${path}/${report.id}`
              }
            >
              See Report
            </Link>
          </li>
        </CardContent>
      </CardContent>
    </Card>
  );
};

export default withStyles(styles)(ListCard);
