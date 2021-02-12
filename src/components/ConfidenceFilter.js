import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Collapse,
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import CheckBoxIntermediateIcon from "mdi-react/CheckboxIntermediateIcon";
import { connect } from "react-redux";
import { updateFilter, toggleFilterConfidence } from "../store/actions";
import ResizableIconButton from "./ResizableIconButton";

const styles = {
  expandHeader: {
    margin: "1em",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: 600,
    color: "rgba(57,57,57,0.9)",
    letterSpacing: "0.58px",
    "&:hover": {
      color: "black !important",
    },
    "&:active": {
      color: "black !important",
    },
    "&:focus": {
      color: "black !important",
    },
  },
  headerTitle: {
    alignText: "left",
  },
  collapsible: {
    textAlign: "left",
  },
  filterWrapper: {
    height: '250px',
    overflow: 'auto',
  },
  resizeButton: {
    width: "0.25em",
    height: "0.25em",
    backgroundColor: "#F6F4F3",
    color: "#757575 !important",
    "&:hover": {
      backgroundColor: "#8DCA22",
      color: "white !important",
    },
    "&:active": {
      backgroundColor: "#8DCA22",
      color: "white !important",
    },
    "&:focus": {
      backgroundColor: "#8DCA22",
      color: "white !important",
    },
  },
  formControlLabel: {
    fontSize: "0.85em",
    fontFamily: "Raleway",
    color: "#767676",
    fontWeight: 500,
  },
};

class ConfidenceFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfidence: false,
    };
  }

  updateFilterSubsection = (subsectionName) => (key, newValue) => {
    updateFilter(subsectionName, key, newValue);
  };

  toggleShow = (groupName) => () => {
    this.setState((state) => ({ ...state, [groupName]: !state[groupName] }));
  };

  toggleConfidence = () => {
    toggleFilterConfidence();
  };

  getCollapse = (classes, headerTitle, onClick, expand, child) => {
    return (
      <>
        <div className={classes.expandHeader}>
          <span className={classes.headerTitle}>{headerTitle}</span>
          <ResizableIconButton
            onClick={onClick}
            disableRipple={true}
            className={classes.resizeButton}
            color={"white"}
          >
            {expand ? <RemoveIcon /> : <AddIcon />}
          </ResizableIconButton>
        </div>
        <Collapse in={expand} className={classes.collapsible}>
          {child}
        </Collapse>
      </>
    );
  };

  render = () => {
    const {
      classes,
      filter: { confidenceFilterActive },
    } = this.props;
    const { showConfidence } = this.state;

    return (
      <>
        {this.getCollapse(
          classes,
          "Confidence of Sighting",
          this.toggleShow("showConfidence"),
          showConfidence,
          <div className={classes.filterWrapper}>
            <FormControl component="fieldset">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={confidenceFilterActive}
                      onChange={this.toggleConfidence}
                      checkedIcon={
                        <CheckBoxIntermediateIcon style={{ color: "#93C838" }} />
                      }
                      style={{ margin: "0px 0px 0px 8px" }}
                    />
                  }
                  label={
                    <Typography className={classes.formControlLabel}>
                      "Only show high-confidence sightings"
                  </Typography>
                  }
                />
              </FormGroup>
            </FormControl>
          </div>
        )}
      </>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    filter: {
      confidenceFilterActive: state.filter.confidenceFilterActive,
    },
  };
};
export default connect(mapStateToProps)(withStyles(styles)(ConfidenceFilter));
