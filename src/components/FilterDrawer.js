import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { connect } from "react-redux";
import { resetFilter, updateNeighborhoodFilters } from "../store/actions";
import Sticky from "react-sticky-fill";
import CarnivoreFilter from "./CarnivoreFilter";
import MediaFilter from "./MediaFilter";
import NeighborhoodFilter from "./NeighborhoodFilter";
import DateTimeFilter from "./DateTimeFilter";
import ConfidenceFilter from "./ConfidenceFilter";
import { debounce } from "lodash";

const styles = {
  allContent: {
    height: "100%",
    position: "static",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Raleway",
    boxShadow: "0px 2px 10px 0px rgba(117,117,117,0.05)",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    backgroundColor: "white",
    zIndex: 1,
    margin: "0 1em",
    padding: 0,
    fontSize: "0.9em",
  },
  mainContent: {
    flex: 1,
    fontSize: "0.85em",
  },
  separator: {
    margin: "0 1em",
    borderColor: "rgba(242, 242, 242, 0.25)",
  },
  reset: {
    fontSize: "0.85em",
    borderRadius: "12.5px",
    backgroundColor: "#F6F4F3",
    color: "#757575",
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

/**
 * Takes in a header as a child component
 */
class FilterDrawer extends React.Component {
  constructor(props) {
    super(props);

    // Initialize state
    this.state = {
      searchedNeighborhood: "",
    };
  }

  handleNeighborhoodSearch = debounce((value) => {
    const {
      filter: { neighborhoodFilter },
    } = this.props;

    const matches = [];
    const nonMatches = [];

    for (let neighborhood in neighborhoodFilter) {
      const lowercaseNeighborhood = neighborhood.toLowerCase();
      const lowercaseSearched = value.toLowerCase().trim();

      if (lowercaseNeighborhood.includes(lowercaseSearched)) {
        matches.push(neighborhood);
      } else {
        nonMatches.push(neighborhood);
      }
    }

    const finalNeighborhoods = matches.concat(nonMatches);
    updateNeighborhoodFilters(finalNeighborhoods);
  }, 100);

  resetNeighborhoodSearch = () => {
    this.setState({
      searchedNeighborhood: "",
    });
  };

  setNeighborhoodSearch = (value) => {
    this.setState({
      searchedNeighborhood: value,
    });
  };

  render = () => {
    const { classes, close } = this.props;
    const { searchedNeighborhood } = this.state;

    return (
      <div className={classes.allContent}>
        <Sticky style={{ backgroundColor: "white", zIndex: 2000 }}>
          <div className={classes.header}>
            {close && <Button onClick={close}>Close</Button>}
            <h3>Filters</h3>
            <Button
              className={classes.reset}
              onClick={() => {
                resetFilter();
                this.resetNeighborhoodSearch();
              }}
            >
              Clear All x
            </Button>
          </div>
          <hr className={classes.separator} />
        </Sticky>
        <div className={classes.mainContent}>
          <CarnivoreFilter />
          <MediaFilter />
          <NeighborhoodFilter
            searchedNeighborhood={searchedNeighborhood}
            handleNeighborhoodSearch={this.handleNeighborhoodSearch}
            setNeighborhoodSearch={this.setNeighborhoodSearch}
          />
          <DateTimeFilter />
          <ConfidenceFilter />
        </div>
      </div>
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
export default connect(mapStateToProps)(withStyles(styles)(FilterDrawer));
