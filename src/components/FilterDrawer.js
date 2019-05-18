import React from 'react';
import DatePicker from 'react-date-picker';
import { withStyles } from '@material-ui/core/styles';
import { Button, Collapse, Fab, FormControl, FormControlLabel, FormGroup, Checkbox} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import FilterCheckboxes from './FilterCheckboxes';
import CheckBoxIntermediateIcon from 'mdi-react/CheckboxIntermediateIcon'
import { connect } from 'react-redux';
import { updateFilter, updateFilterDate, toggleFilterConfidence, resetFilter } from '../store/actions'

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

const carnivoreColorMap = {
    Bears: 'pink',
    Bobcats: 'green',
    Coyotes: 'purple',
    'Mountain Lions': 'orange',
    Racoons: 'blue',
    Other: 'yellow'
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
            showNeighborhoods: false,
            showTime: false,
            showConfidence: false
        }
    }

    // TODO fix the name
    updateFilter = filterName => (key, newValue) => {
        updateFilter(filterName, key, newValue);
    }

    toggleShow = groupName => () => {
        this.setState(state => ({...state,
                [groupName]: !state[groupName]}));
    }

    handleDateChange = newDate => {
        if (newDate) {
            updateFilterDate(new Date(newDate));
        }
        else {
            updateFilterDate(newDate);
        }
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

    render = () => {
        const {classes, cancel, children, filter: {date, confidenceFilterActive, carnivoreFilter, neighborhoodFilter, timeFilter}} = this.props;
        const {showCarnivores, showNeighborhoods, showTime, showConfidence} = this.state;
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
                            updateValues={this.updateFilter('carnivoreFilter')}
                            briefNumber={Object.keys(carnivoreFilter).length - 1}
                            keyColorMap={carnivoreColorMap}/>
                    )}
                    <hr/>

                    {/* Neighborhoods */}
                    {this.getCollapse(classes, "Neighborhood", this.toggleShow('showNeighborhoods'), showNeighborhoods,
                        <FilterCheckboxes
                            filter={neighborhoodFilter}
                            allLabel="All Neighborhoods"
                            updateValues={this.updateFilter('neighborhoodFilter')}
                            briefNumber={briefNeighborhoodsCount}/>
                    )}
                    <hr/>

                    {/* Time and Day */}
                    {this.getCollapse(classes, "Time of Sighting", this.toggleShow('showTime'), showTime,
                        <>
                            Date:
                            <DatePicker
                                value={date}
                                onChange={this.handleDateChange}/> <br/>
                            Time of Day:
                            <FilterCheckboxes
                                filter={timeFilter}
                                allLabel="Any time of day"
                                updateValues={this.updateFilter('timeFilter')}
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
                <Button variant="contained"
                    className={classes.resultsButton}
                    onClick={() => console.log({date, confidenceFilterActive, carnivoreFilter, neighborhoodFilter, timeFilter})}>
                        See Results
                </Button>
            </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        filter: {
            carnivoreFilter: state.filter.carnivoreFilter,
            neighborhoodFilter: state.filter.neighborhoodFilter,
            timeFilter: state.filter.timeFilter,
            date: state.filter.date,
            confidenceFilterActive: state.filter.confidenceFilterActive,
        }
    }
}

export default connect(mapStateToProps)(withStyles(styles)(FilterDrawer));