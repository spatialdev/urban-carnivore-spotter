import SpeciesCardInfo from "./SpeciesCardInfo";
import React from "react";
import { withStyles } from "@material-ui/core";

const styles = {
  image: {
    width: "100%",
    objectFit: "contain",
    borderRadius: "0px 0px 6px 6px",
  },
  speciesHeader: {
    margin: "4px 0px 0px 24px",
    textAlign: "left",
  },
  headerContainer: {
    backgroundColor: "black",
    color: "white",
    padding: "2em 0 2em 0",
    marginTop: "0.65em",
    borderRadius: "6px 6px 0px 0px",
  },
  allContent: {
    backgroundColor: "#fff",
    maxWidth: 1100,
    display: "flex",
  },
  headerAndImageContainer: {
    width: "50%",
  },
};

const SpeciesCardDesktop = (props) => {
  const {
    classes,
    speciesName,
    latinName,
    weight,
    height,
    diet,
    identTips,
    largerThanLab,
    imagePath,
  } = props;
  return (
    <div className={classes.allContent}>
      <div className={classes.headerAndImageContainer}>
        <div className={classes.headerContainer}>
          <h3 className={classes.speciesHeader}>{speciesName}</h3>
          <h4 className={classes.speciesHeader}>
            (<em>{latinName}</em>)
          </h4>
        </div>
        <img className={classes.image} src={imagePath} alt={speciesName} />
      </div>
      <SpeciesCardInfo
        weight={weight}
        height={height}
        diet={diet}
        identTips={identTips}
        largerThanLab={largerThanLab}
      />
    </div>
  );
};

export default withStyles(styles)(SpeciesCardDesktop);
