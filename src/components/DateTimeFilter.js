import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Collapse } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import FilterCheckboxes from "./FilterCheckboxes";
import { connect } from "react-redux";
import {
  updateFilter,
  updateFilterDate,
  toggleFilterConfidence,
} from "../store/actions";
import ResizableIconButton from "./ResizableIconButton";

// Date picker
import "react-dates/initialize";
import { DateRangePicker } from "react-dates";
import { START_DATE, END_DATE } from "react-dates/esm/constants";
import "react-dates/lib/css/_datepicker.css";

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

class DateTimeFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showTime: true,
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

  render = () => {
    const {
      classes,
      filter: { startDate, endDate, timeFilter, dateFilter },
    } = this.props;
    const { showTime, dateRangeFocused } = this.state;

    return (
      <>
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
      </>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    filter: {
      timeFilter: state.filter.timeFilter,
      dateFilter: state.filter.dateFilter,
      startDate: state.filter.startDate,
      endDate: state.filter.endDate,
    },
  };
};
export default connect(mapStateToProps)(withStyles(styles)(DateTimeFilter));
