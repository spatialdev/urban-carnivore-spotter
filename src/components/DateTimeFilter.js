import React from "react";
import { withStyles } from "@material-ui/core/styles";
import FilterCheckboxes from "./FilterCheckboxes";
import { connect } from "react-redux";
import {
  updateFilter,
  updateFilterDate,
  toggleFilterConfidence,
} from "../store/actions";

// Date picker
import "react-dates/initialize";
import { DateRangePicker } from "react-dates";
import { START_DATE, END_DATE } from "react-dates/esm/constants";
import "react-dates/lib/css/_datepicker.css";
import Collapsible from './Collapsible';

const styles = {
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
};

class DateTimeFilter extends React.Component {
  constructor ( props ) {
    super( props );

    this.state = {
      showTime: true,
      dateRangeFocused: null,
    };
  }

  updateFilterSubsection = ( subsectionName ) => ( key, newValue ) => {
    updateFilter( subsectionName, key, newValue );
  };

  toggleShow = ( groupName ) => () => {
    this.setState( ( state ) => ( { ...state, [groupName]: !state[groupName] } ) );
  };

  toggleConfidence = () => {
    toggleFilterConfidence();
  };

  isOutsideRange = ( date ) => {
    const {
      filter: { startDate, endDate },
    } = this.props;
    const { dateRangeFocused } = this.state;
    return (
      ( dateRangeFocused === START_DATE &&
        !( endDate === null || date.isSameOrBefore( endDate, "day" ) ) ) ||
      ( dateRangeFocused === END_DATE &&
        !( startDate === null || date.isSameOrAfter( startDate, "day" ) ) )
    );
  };

  render = () => {
    const {
      classes,
      filter: { startDate, endDate, timeFilter, dateFilter },
    } = this.props;
    const { showTime, dateRangeFocused } = this.state;

    return (
      <Collapsible
        headerTitle="Date/Time of Sighting"
        onClick={ this.toggleShow( "showTime" ) }
        expand={ showTime }
      >
        <div className={ classes.dateFilters }>
          Date Filters:
              <FilterCheckboxes
            filter={ dateFilter }
            allLabel="All"
            updateValues={ this.updateFilterSubsection( "dateFilter" ) }
            briefNumber={ Object.keys( dateFilter ).length - 1 }
          />
          <div className={ classes.datePickerWrapper }>
            <DateRangePicker
              startDate={ startDate }
              startDateId={ "start_date" }
              endDate={ endDate }
              endDateId={ "end_date" }
              onDatesChange={ ( { startDate: rawStart, endDate: rawEnd } ) =>
                updateFilterDate( rawStart, rawEnd )
              }
              focusedInput={ dateRangeFocused }
              onFocusChange={ ( focusedInput ) =>
                this.setState( { dateRangeFocused: focusedInput } )
              }
              showClearDates={ true }
              numberOfMonths={ 1 }
              isOutsideRange={ this.isOutsideRange }
              small={ true }
              daySize={ 35 }
            />
          </div>
        </div>
        <div className={ classes.timeFilters }>
          Time Filters:
              <FilterCheckboxes
            filter={ timeFilter }
            allLabel="Any time of day"
            updateValues={ this.updateFilterSubsection( "timeFilter" ) }
            briefNumber={ Object.keys( timeFilter ).length - 1 }
          />
        </div>
      </Collapsible>
    );
  };
}

const mapStateToProps = ( state ) => {
  return {
    filter: {
      timeFilter: state.filter.timeFilter,
      dateFilter: state.filter.dateFilter,
      startDate: state.filter.startDate,
      endDate: state.filter.endDate,
    },
  };
};
export default connect( mapStateToProps )( withStyles( styles )( DateTimeFilter ) );
