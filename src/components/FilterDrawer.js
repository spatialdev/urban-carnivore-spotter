import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Collapse,
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
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
    overflow: "auto",
    position: "static",
    display: "flex",
    flexDirection: "column",
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
    padding: "4px 24px 4px 24px",
  },
  filterBox: {},
  mainContent: {
    flex: 1,
  },
  expandHeader: {
    margin: "16px 16px 16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    alignText: "left",
  },
  collapsible: {
    textAlign: "left",
  },
  separator: {
    margin: 0,
  },
  datePicker: {
    paddingLeft: "10px",
  },
  dateFilters: {
    margin: "0 1.5em",
  },
  timeFilters: {
    margin: "1.5em",
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
            backgroundColor={"#93C838"}
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
    } = this.state;

    return (
      <div className={classes.allContent}>
        <Sticky>
          <div className={classes.header}>
            {close && <Button onClick={close}>Close</Button>}
            <h3>Filter</h3>
            <Button onClick={resetFilter}>Reset</Button>
          </div>
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
            <FilterCheckboxes
              filter={neighborhoodFilter}
              allLabel="All Neighborhoods"
              updateValues={this.updateFilterSubsection("neighborhoodFilter")}
              briefNumber={briefNeighborhoodsCount}
            />
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
                <div className={classes.datePicker}>
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
                    daySize={30}
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
                  label="Only show high-confidence sightings"
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
