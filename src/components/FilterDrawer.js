import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Collapse, Fab, FormControl, FormControlLabel, FormGroup, Checkbox} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import FilterCheckboxes from './FilterCheckboxes';
import CheckBoxIntermediateIcon from 'mdi-react/CheckboxIntermediateIcon'
import { connect } from 'react-redux';
import { updateFilter, updateFilterDate, toggleFilterConfidence, resetFilter } from '../store/actions'
import { getColorForSpecies } from '../services/ColorService';

// Date picker
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import { START_DATE, END_DATE } from "react-dates/esm/constants";
import 'react-dates/lib/css/_datepicker.css';

const styles = {
    allContent: {
        height: '100%',
        overflow: 'scroll',
        position: 'static',
        display: 'flex',
        flexDirection: 'column'
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        backgroundColor: 'white',
        zIndex: 1
    },
    filterBox: {},
    mainContent: {
        flex: 1
    },
    resultsButton: {
        position: 'sticky',
        bottom: 4,
        left: '5%',
        width: '90%',
        justifyContent: 'center',
        color: 'white',
        backgroundColor: '#93C838'
    },
    expandButton: {
        boxShadow: 'none',
        float: 'right',
        position: 'relative',
        top: -8,
        backgroundColor: '#93C838',
        color: 'white'
    },
    expandHeader: {
        margin: 16,
        display: 'flex',
        justifyContent: 'space-between'
    },
    headerTitle: {
        alignText: 'left'
    },
    collapsible: {
        textAlign: 'left'
    }
}

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
            showNeighborhoods: false,
            showTime: false,
            showConfidence: false,
            dateRangeFocused: null,
        }
    }

    updateFilterSubsection = subsectionName => (key, newValue) => {
        updateFilter(subsectionName, key, newValue);
    }

    toggleShow = groupName => () => {
        this.setState(state => ({...state,
                [groupName]: !state[groupName]}));
    }

    toggleConfidence = () => {
        toggleFilterConfidence();
    }

    getCollapse = (classes, headerTitle, onClick, expand, child) => {
        return <>
            <div className={classes.expandHeader}>
                <span className={classes.headerTitle}>{headerTitle}</span>
                <Fab
                    className={classes.expandButton}
                    onClick={onClick}
                    size="small"
                    disableRipple={true}>
                        {expand ? <RemoveIcon /> : <AddIcon />}
                </Fab>
            </div>
            <Collapse in={expand} className={classes.collapsible}>
                {child}
            </Collapse>
        </>
    }

    isOutsideRange = (date) => {
        const { filter: { startDate, endDate }} = this.props;
        const { dateRangeFocused } = this.state;
        return (dateRangeFocused === START_DATE && !(endDate === null || date.isSameOrBefore(endDate, 'day'))) ||
            (dateRangeFocused === END_DATE && !(startDate === null || date.isSameOrAfter(startDate, 'day')));
    }

    render = () => {
        const {classes, cancel, children, filter: {startDate, endDate, confidenceFilterActive, carnivoreFilter, neighborhoodFilter, timeFilter}} = this.props;
        const {showCarnivores, showNeighborhoods, showTime, showConfidence, dateRangeFocused} = this.state;
        return (
            <div className={classes.allContent}>
                {children}
                <div className={classes.header}>
                    {cancel && <Button onClick={cancel}>Cancel</Button> }
                    <h3 style={{margin: 4}}>Filter</h3>
                    <Button onClick={resetFilter}>Reset</Button>
                </div>
                <div className={classes.mainContent}>
                    {/* Carnivores */}
                    {this.getCollapse(classes, "Type of Carnivore", this.toggleShow('showCarnivores'), showCarnivores,
                        <FilterCheckboxes
                            filter={carnivoreFilter}
                            allLabel="All Carnivores"
                            updateValues={this.updateFilterSubsection('carnivoreFilter')}
                            briefNumber={Object.keys(carnivoreFilter).length - 1}
                            keyColorFunction={getColorForSpecies}/>
                    )}
                    <hr/>

                    {/* Neighborhoods */}
                    {this.getCollapse(classes, "Neighborhood", this.toggleShow('showNeighborhoods'), showNeighborhoods,
                        <FilterCheckboxes
                            filter={neighborhoodFilter}
                            allLabel="All Neighborhoods"
                            updateValues={this.updateFilterSubsection('neighborhoodFilter')}
                            briefNumber={briefNeighborhoodsCount}/>
                    )}
                    <hr/>

                    {/* Time and Day */}
                    {this.getCollapse(classes, "Time of Sighting", this.toggleShow('showTime'), showTime,
                        <>
                            Date:
                            <DateRangePicker
                                startDate={startDate}
                                startDateId={"some_id"}
                                endDate={endDate}
                                endDateId={"some_other_id"}
                                onDatesChange={({ startDate: rawStart, endDate: rawEnd}) => updateFilterDate(rawStart, rawEnd)}
                                focusedInput={dateRangeFocused}
                                onFocusChange={focusedInput => this.setState( { dateRangeFocused: focusedInput})}
                                showClearDates={true}
                                numberOfMonths={1}
                                isOutsideRange={this.isOutsideRange}
                                small={true}
                                daySize={30}
                            />
                            <FilterCheckboxes
                                filter={timeFilter}
                                allLabel="Any time of day"
                                updateValues={this.updateFilterSubsection('timeFilter')}
                                briefNumber={Object.keys(timeFilter).length - 1}/>
                        </>
                    )}
                    <hr/>

                    {/* Confidence */}
                    {this.getCollapse(classes, "Confidence of Sighting", this.toggleShow('showConfidence'), showConfidence,
                        <FormControl component="fieldset">
                            <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox
                                                checked={confidenceFilterActive}
                                                onChange={this.toggleConfidence}
                                                checkedIcon={<CheckBoxIntermediateIcon style={{color: '#93C838'}}/>}
                                                style={{margin: '0px 0px 0px 8px'}}/>}
                                    label="Only show high-confidence sightings" />
                            </FormGroup>
                        </FormControl>
                    )}
                </div>
            </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        filter: {
            carnivoreFilter: state.filter.carnivoreFilter,
            neighborhoodFilter: state.filter.neighborhoodFilter,
            timeFilter: state.filter.timeFilter,
            startDate: state.filter.startDate,
            endDate: state.filter.endDate,
            confidenceFilterActive: state.filter.confidenceFilterActive,
        }
    }
}

export default connect(mapStateToProps)(withStyles(styles)(FilterDrawer));