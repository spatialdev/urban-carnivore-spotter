import React from 'react';
import DatePicker from 'react-date-picker';
import { withStyles } from '@material-ui/core/styles';
import { Button, Collapse, Fab, FormControl, FormControlLabel, FormGroup, Checkbox} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import FilterCheckboxes from './FilterCheckboxes';
import CheckBoxIntermediateIcon from 'mdi-react/CheckboxIntermediateIcon'


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

const allCarnivores = ['Bears', 'Bobcats', 'Coyotes', 'Mountain Lions', 'Racoons', 'Other'];
const carnivoreColorMap = {
    Bears: 'pink',
    Bobcats: 'green',
    Coyotes: 'purple',
    'Mountain Lions': 'orange',
    Racoons: 'blue',
    Other: 'yellow'
};
const allNeighborhoods = ['Ballard', 'Beacon Hill', 'Bothell', 'Broadview', 'Burien', 'Capitol Hill', 'Chinatown', 'Downtown'] // and more...
const allTimes = ['Early Morning (12:00am-4:59am)', 'Morning (5:00am-11:59am)', 'Afternoon (12:00pm-5:59pm)', 'Evening (6:00pm-11:59pm)'];
const briefNeighborhoodsCount = 5;

/**
 * Takes in a header as a child component
 */
class FilterDrawer extends React.Component {

    constructor(props) {
        super(props);
        
        // Carnivore, neighborhood, and times defaults
        const defaultCarnivoreFilter = {all: true};
        allCarnivores.forEach(carnivore => defaultCarnivoreFilter[carnivore] = false);
        const defaultNeighborhoodFilter = {all: true};
        allNeighborhoods.forEach(neighborhood => defaultNeighborhoodFilter[neighborhood] = false);
        const defaultTimeFilter = {all: true};
        allTimes.forEach(time => defaultTimeFilter[time] = false);

        // We want to save a copy of the initial state so we can reset easily
        this.initialState = {
            carnivoreFilter: {...defaultCarnivoreFilter},
            neighborhoodFilter: {...defaultNeighborhoodFilter},
            date: null,
            timeFilter: {...defaultTimeFilter},
            confidenceFilterActive: false,
            show: {
                showCarnivores: false,
                showNeighborhoods: false,
                showTime: false,
                showConfidence: false
            }
        }

        // Initialize state
        this.state = {...this.initialState}
    }

    updateFilter = filterName => (key, newValue) => {
        this.setState(state => ({...state,
            [filterName]: {...state[filterName],
                [key]: newValue}}));
    }


    toggleShow = groupName => () => {
        this.setState(state => ({...state,
            show: {...state.show,
                [groupName]: !state.show[groupName]}}));
    }

    handleDateChange = newDate => {
        if (newDate) {
            this.setState(({date: new Date(newDate)}));
        }
        else {
            this.setState(({date: newDate}));
        }
    }

    toggleConfidence = () => {
        this.setState(state => ({...state,
            confidenceFilterActive: !state.confidenceFilterActive}));
    }

    reset = () => {
        // Don't reset the state of expansions
        this.setState(state => ({...this.initialState,
            show: state.show}));
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
        const {classes, cancel, children} = this.props;
        const {show: {showCarnivores, showNeighborhoods, showTime, showConfidence},
            date, confidenceFilterActive, carnivoreFilter, neighborhoodFilter, timeFilter} = this.state;
        return (
            <div className={classes.allContent}>
                {children}
                <div className={classes.header}>
                    {cancel && <Button onClick={cancel}>Cancel</Button> }
                    <h3 style={{margin: 4}}>Filter</h3>
                    <Button onClick={this.reset}>Reset</Button>
                </div>
                <div className={classes.mainContent}>
                    {/* Carnivores */}
                    {this.getCollapse(classes, "Type of Carnivore", this.toggleShow('showCarnivores'), showCarnivores,
                        <FilterCheckboxes
                            filter={carnivoreFilter}
                            allLabel="All Carnivores"
                            updateValues={this.updateFilter('carnivoreFilter')}
                            briefNumber={allCarnivores.length}
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
                            <FilterCheckboxes filter={timeFilter} allLabel="Any time of day" updateValues={this.updateFilter('timeFilter')} briefNumber={allTimes.length}/>
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
                                                checkedIcon={<CheckBoxIntermediateIcon/>}
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

export default withStyles(styles)(FilterDrawer);