import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Collapse, TextField } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import FilterCheckboxes from "./FilterCheckboxes";
import { connect } from "react-redux";
import { updateFilter } from "../store/actions";
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
  separator: {
    margin: "0 1em",
    borderColor: "rgba(242, 242, 242, 0.25)",
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
};

const briefNeighborhoodsCount = 5;
class NeighborhoodFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showNeighborhoods: false,
    };
  }

  updateFilterSubsection = (subsectionName) => (key, newValue) => {
    updateFilter(subsectionName, key, newValue);
  };

  toggleShow = (groupName) => () => {
    this.setState((state) => ({ ...state, [groupName]: !state[groupName] }));
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
      filter: { neighborhoodFilter },
      searchedNeighborhood,
      handleNeighborhoodSearch,
      setNeighborhoodSearch,
    } = this.props;
    const { showNeighborhoods } = this.state;

    return (
      <>
        {this.getCollapse(
          classes,
          "Neighborhood",
          this.toggleShow("showNeighborhoods"),
          showNeighborhoods,
          <>
            <TextField
              label="Search Neighborhood"
              margin="normal"
              variant="outlined"
              value={searchedNeighborhood}
              onKeyDown={(e) => {
                handleNeighborhoodSearch(e);
              }}
              onChange={(e) => {
                setNeighborhoodSearch(e);
              }}
            />
            <FilterCheckboxes
              filter={neighborhoodFilter}
              allLabel="All Neighborhoods"
              updateValues={this.updateFilterSubsection("neighborhoodFilter")}
              briefNumber={briefNeighborhoodsCount}
            />
          </>
        )}
        <hr className={classes.separator} />
      </>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    filter: {
      neighborhoodFilter: state.filter.neighborhoodFilter,
    },
  };
};
export default connect(mapStateToProps)(withStyles(styles)(NeighborhoodFilter));
