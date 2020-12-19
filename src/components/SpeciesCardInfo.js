import React from "react";

import Labrador from "../assets/Labrador.svg";
import { withStyles } from "@material-ui/core";

const styles = {
  characteristic: {
    textAlign: "left",
    marginLeft: 24,
  },
  labrador: {
    backgroundColor: "white",
    border: "none",
    outline: "none",
    borderRadius: "6px",
    boxShadow: "0px 2px 10px 0px rgba(117,117,117,0.25)",
    margin: 11,
    "& p": {
      marginLeft: 11,
    },
    "& img": {
      margin: 16,
      width: "46px !important",
    },
    display: "flex",
    justifyContent: "space-between",
  },
};

const SpeciesCardInfo = (props) => {
  const { classes, weight, height, diet, identTips, largerThanLab } = props;
  return (
    <div style={{ width: "100%" }}>
      <p className={classes.characteristic}>
        <strong>Weight:</strong> {weight}
      </p>
      <p className={classes.characteristic}>
        <strong>Height at shoulder:</strong> {height}
      </p>
      <p className={classes.characteristic}>
        <strong>Diet:</strong> {diet}
      </p>
      <p className={classes.characteristic}>
        <strong>Identification tips:</strong> {identTips}
      </p>
      <div className={classes.labrador}>
        <div>
          <p className={classes.characteristic}>
            <strong>
              {largerThanLab ? "Larger" : "Smaller"} than a Labrador!
            </strong>
          </p>
          <p className={classes.characteristic}>
            <strong>Lab weight:</strong> 55-80 lbs / 25-26 kg
          </p>
          <p className={classes.characteristic}>
            <strong>Lab height:</strong> 21-25 in / 53-62 cm
          </p>
        </div>
        <img src={Labrador} alt={"Labrador"} />
      </div>
    </div>
  );
};

export default withStyles(styles)(SpeciesCardInfo);
