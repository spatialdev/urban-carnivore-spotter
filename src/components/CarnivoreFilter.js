import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Collapse } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import FilterCheckboxes from "./FilterCheckboxes";
import { connect } from "react-redux";
import { updateFilter } from "../store/actions";
import { getColorForSpecies } from "../services/ColorService";
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

class CarnivoreFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCarnivores: false,
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
      filter: { carnivoreFilter },
    } = this.props;
    const { showCarnivores } = this.state;

    return (
      <>
        {this.getCollapse(
          classes,
          "Type of Carnivore",
          this.toggleShow("showCarnivores"),
          showCarnivores,
          <div className={classes.filterWrapper}>
            <FilterCheckboxes
              filter={carnivoreFilter}
              allLabel="All Carnivores"
              updateValues={this.updateFilterSubsection("carnivoreFilter")}
              briefNumber={Object.keys(carnivoreFilter).length - 1}
              keyColorFunction={getColorForSpecies}
            />
          </div>
        )}
        <hr className={classes.separator} />
      </>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    filter: {
      carnivoreFilter: state.filter.carnivoreFilter,
    },
  };
};
export default connect(mapStateToProps)(withStyles(styles)(CarnivoreFilter));
