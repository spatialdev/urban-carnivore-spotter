import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Collapse,
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Typography,
  TextField,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import FilterCheckboxes from "./FilterCheckboxes";
import CheckBoxIntermediateIcon from "mdi-react/CheckboxIntermediateIcon";
import { connect } from "react-redux";
import {
  updateFilter,
  updateFilterDate,
  toggleFilterConfidence,
  resetFilter,
} from "../store/actions";
import { getColorForSpecies } from "../services/ColorService";
import ResizableIconButton from "./ResizableIconButton";
import Sticky from "react-sticky-fill";

// Date picker
import "react-dates/initialize";
import { DateRangePicker } from "react-dates";
import { START_DATE, END_DATE } from "react-dates/esm/constants";
import "react-dates/lib/css/_datepicker.css";

const styles = {
  allContent: {
    height: "100%",
    position: "static",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Raleway",
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
  filterBox: {},
  mainContent: {
    flex: 1,
    fontSize: "0.85em",
  },
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
  datePickerWrapper: {
    textAlign: "center",
    margin: "0 1.5em",
  },
  dateFilters: {
    margin: "0 1.5em",
  },
  timeFilters: {
    margin: "1.5em",
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

const briefNeighborhoodsCount = 5;

/**
 * Takes in a header as a child component
 */
class FilterDrawer extends React.Component {
  constructor(props) {
    super(props);

    // Initialize state
    this.state = {
      showCarnivores: false,
      showMedia: false,
      showNeighborhoods: false,
      showTime: false,
      showConfidence: false,
      dateRangeFocused: null,
      searchedNeighborhood: "",
    };
  }

  updateFilterSubsection = (subsectionName) => (key, newValue) => {
    console.log("UPDATE", subsectionName, key, newValue);
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

  isOutsideRange = (date) => {
    const {
      filter: { startDate, endDate },
    } = this.props;
    const { dateRangeFocused } = this.state;
    return (
      (dateRangeFocused === START_DATE &&
        !(endDate === null || date.isSameOrBefore(endDate, "day"))) ||
      (dateRangeFocused === END_DATE &&
        !(startDate === null || date.isSameOrAfter(startDate, "day")))
    );
  };

  handleNeighborhoodSearch = (event) => {
    if (event.keyCode === 13) {
      const { value } = event.target;
      const {
        filter: { neighborhoodFilter },
      } = this.props;
      const autocompleteNeighborhoods = {};
      let newOrder = 0;

      for (let neighborhood in neighborhoodFilter) {
        const lowercaseNeighborhood = neighborhood.toLowerCase();
        const lowercaseSearched = value.toLowerCase().trim();

        if (lowercaseNeighborhood.includes(lowercaseSearched)) {
          autocompleteNeighborhoods[neighborhood] = false;
          updateFilter("neighborhoodFilter", neighborhood, false, newOrder);
          newOrder++;
        }
      }

      for (let neighborhood in neighborhoodFilter) {
        if (!autocompleteNeighborhoods.hasOwnProperty(neighborhood)) {
          updateFilter("neighborhoodFilter", neighborhood, false, newOrder);
          newOrder++;
        }
      }
    }
  };

  render = () => {
    const {
      classes,
      close,
      filter: {
        startDate,
        endDate,
        confidenceFilterActive,
        carnivoreFilter,
        mediaFilter,
        neighborhoodFilter,
        timeFilter,
        dateFilter,
      },
    } = this.props;
    const {
      showCarnivores,
      showMedia,
      showNeighborhoods,
      showTime,
      showConfidence,
      dateRangeFocused,
      searchedNeighborhood,
    } = this.state;

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
                this.setState({
                  searchedNeighborhoods: null,
                  searchedNeighborhood: "",
                });
              }}
            >
              Clear All x
            </Button>
          </div>
          <hr className={classes.separator} />
        </Sticky>
        <div className={classes.mainContent}>
          {/* Carnivores */}
          {this.getCollapse(
            classes,
            "Type of Carnivore",
            this.toggleShow("showCarnivores"),
            showCarnivores,
            <FilterCheckboxes
              filter={carnivoreFilter}
              allLabel="All Carnivores"
              updateValues={this.updateFilterSubsection("carnivoreFilter")}
              briefNumber={Object.keys(carnivoreFilter).length - 1}
              keyColorFunction={getColorForSpecies}
            />
          )}
          <hr className={classes.separator} />

          {/* Media */}
          {this.getCollapse(
            classes,
            "Media",
            this.toggleShow("showMedia"),
            showMedia,
            <FilterCheckboxes
              filter={mediaFilter}
              allLabel="All Media"
              updateValues={this.updateFilterSubsection("mediaFilter")}
              briefNumber={Object.keys(mediaFilter).length - 1}
            />
          )}
          <hr className={classes.separator} />

          {/* Neighborhoods */}
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
                  this.handleNeighborhoodSearch(e);
                }}
                onChange={(e) => {
                  this.setState({
                    searchedNeighborhood: e.target.value,
                  });
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

          {/* Time and Day */}
          {this.getCollapse(
            classes,
            "Date/Time of Sighting",
            this.toggleShow("showTime"),
            showTime,
            <>
              <div className={classes.dateFilters}>
                Date Filters:
                <FilterCheckboxes
                  filter={dateFilter}
                  allLabel="All"
                  updateValues={this.updateFilterSubsection("dateFilter")}
                  briefNumber={Object.keys(dateFilter).length - 1}
                />
                <div className={classes.datePickerWrapper}>
                  <DateRangePicker
                    startDate={startDate}
                    startDateId={"start_date"}
                    endDate={endDate}
                    endDateId={"end_date"}
                    onDatesChange={({ startDate: rawStart, endDate: rawEnd }) =>
                      updateFilterDate(rawStart, rawEnd)
                    }
                    focusedInput={dateRangeFocused}
                    onFocusChange={(focusedInput) =>
                      this.setState({ dateRangeFocused: focusedInput })
                    }
                    showClearDates={true}
                    numberOfMonths={1}
                    isOutsideRange={this.isOutsideRange}
                    small={true}
                    daySize={35}
                  />
                </div>
              </div>
              <div className={classes.timeFilters}>
                Time Filters:
                <FilterCheckboxes
                  filter={timeFilter}
                  allLabel="Any time of day"
                  updateValues={this.updateFilterSubsection("timeFilter")}
                  briefNumber={Object.keys(timeFilter).length - 1}
                />
              </div>
            </>
          )}
          <hr className={classes.separator} />

          {/* Confidence */}
          {this.getCollapse(
            classes,
            "Confidence of Sighting",
            this.toggleShow("showConfidence"),
            showConfidence,
            <FormControl component="fieldset">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={confidenceFilterActive}
                      onChange={this.toggleConfidence}
                      checkedIcon={
                        <CheckBoxIntermediateIcon
                          style={{ color: "#93C838" }}
                        />
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
          )}
        </div>
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    filter: {
      carnivoreFilter: state.filter.carnivoreFilter,
      mediaFilter: state.filter.mediaFilter,
      neighborhoodFilter: state.filter.neighborhoodFilter,
      timeFilter: state.filter.timeFilter,
      dateFilter: state.filter.dateFilter,
      startDate: state.filter.startDate,
      endDate: state.filter.endDate,
      confidenceFilterActive: state.filter.confidenceFilterActive,
    },
  };
};

export default connect(mapStateToProps)(withStyles(styles)(FilterDrawer));
