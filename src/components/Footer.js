import React from "react";
import AddIcon from "@material-ui/icons/Add";
import MapIcon from "@material-ui/icons/Map";
import HelpIcon from "@material-ui/icons/Help";
import SettingsIcon from "@material-ui/icons/Settings";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import { withStyles } from "@material-ui/core/styles";
import FaqIcon from "../assets/FAQ.svg";
import { withRouter } from "react-router";

const styles = (theme) => ({
  list: {
    width: 250,
  },
  fullList: {
    width: "100%",
  },
  fab: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  footerIconDiv: {
    borderTop: "1px grey solid",
    width: "100%",
    bottom: 0,
    left: 0,
    padding: "25px 0",
    backgroundColor: "white",
    position: "sticky",
    zIndex: "101",
    display: "flex",
    justifyContent: "space-around",
  },
  flexColumn: {
    flexGrow: 1,
    flexBasis: "30%",
  },
  plusButton: {
    position: "relative",
    top: -50,
    left: 70,
  },
  footerIcons: {
    marginTop: "0.75em",
    "& span": {
      display: "block",
    },
    "& p": {
      textTransform: "capitalize",
      margin: 0,
    },
  },
});

const Footer = (props) => {
  const { classes, history } = props;
  const isTacoma = history.location.pathname.indexOf("tacoma") !== -1;

  return (
    <div className={classes.footerIconDiv}>
      <div className={classes.flexColumn}>
        <Button
          className={classes.footerIcons}
          style={{
            float: "left",
            marginLeft: "50px",
            color: history.location.pathname === "/" ? "#3411ff" : "grey",
          }}
        >
          <MapIcon
            style={{
              color:
                history.location.pathname === "/" || isTacoma
                  ? "#3411FF"
                  : "grey",
            }}
            onClick={() =>
              isTacoma ? history.push("/tacoma") : history.push("/")
            }
          />
          <p>Explore</p>
        </Button>
      </div>
      <div className={classes.flexColumn}>
        <Fab
          style={{ backgroundColor: "#8acc25" }}
          aria-label="Add"
          className={classes.plusButton}
          size={"large"}
          onClick={() =>
            isTacoma
              ? history.push("/tacoma/reports/create")
              : history.push("/reports/create")
          }
        >
          <AddIcon style={{ color: "#FFFFFF" }} />
        </Fab>
      </div>
      <div className={classes.flexColumn}>
        <Button
          className={classes.footerIcons}
          style={{
            float: "right",
            marginRight: "50px",
            color: history.location.pathname.includes("/resources")
              ? "#3411FF"
              : "grey",
          }}
          onClick={() =>
            isTacoma
              ? history.push("/tacoma/resources")
              : history.push("/resources")
          }
        >
          <SettingsIcon
            style={{
              color: history.location.pathname.includes("/resources")
                ? "#3411FF"
                : "grey",
            }}
          />
          <p>Resources</p>
        </Button>
      </div>
      <div className={classes.flexColumn}>
        <Button
          className={classes.footerIcons}
          style={{
            float: "right",
            marginRight: "50px",
            color: history.location.pathname.includes("/faq")
              ? "#3411FF"
              : "grey",
          }}
          onClick={() => history.push("/faq")}
        >
          <HelpIcon
            style={{
              color: history.location.pathname.includes("/faq")
                ? "#3411FF"
                : "grey",
            }}
          />
          <p>FAQ</p>
        </Button>
      </div>
    </div>
  );
};

export default withRouter(withStyles(styles)(Footer));
