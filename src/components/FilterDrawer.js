import React from 'react';
import DatePicker from 'react-datepicker';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Button, Collapse, Fab, FormControl, FormControlLabel, FormGroup, Checkbox} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import FilterCheckboxes from './FilterCheckboxes';
import CheckBoxIntermediateIcon from 'mdi-react/CheckboxIntermediateIcon'


const styles = {
    allContent: {},
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
    resultsButton: {
        position: 'sticky',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white'
    },
    expandButton: {
        boxShadow: 'none',
        float: 'right',
        position: 'relative',
        top: -8
    },
    expandHeader: {
        margin: 16
    }
}

const allCarnivores = ['Bears', 'Bobcats', 'Coyotes', 'Mountain Lions', 'Racoons', 'Other'];
const allNeighborhoods = ['Ballard', 'Beacon Hill', 'Bothell', 'Broadview', 'Burien', 'Capitol Hill', 'Chinatown', 'Downtown'] // and more...
const allTimes = ['Early Morning (12:00am-4:59am)', 'Morning (5:00am-11:59am)', 'Afternoon (12:00pm-5:59pm)', 'Evening (6:00pm-11:59pm)'];
const briefNeighborhoodsCount = 5;

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
            date: new Date(),
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
        this.setState(state => ({...state,
            date: new Date(newDate)}));
    }

    toggleConfidence = () => {
        this.setState(state => ({...state,
            confidenceFilterActive: !state.confidenceFilterActive}));
    }

    applyFilter = () => {
        console.log(this.state);
    }

    reset = () => {
        // Don't reset the state of expansions
        this.setState(state => ({...this.initialState,
            show: state.show}));
    }

    getCollapse = (classes, headerTitle, onClick, expand, child) => {
        return <>
            <div className={classes.expandHeader}>
                {headerTitle}
                <Fab
                    className={classes.expandButton}
                    onClick={onClick}
                    size="small"
                    disableRipple={true}>
                        {expand ? <RemoveIcon /> : <AddIcon />}
                </Fab>
            </div>
            <Collapse in={expand}>
                {child}
            </Collapse>
        </>
    }

    render() {
        const {classes, cancel} = this.props;
        const {show: {showCarnivores, showNeighborhoods, showTime, showConfidence},
            date, confidenceFilterActive, carnivoreFilter, neighborhoodFilter, timeFilter} = this.state;
        return (
            <div className={classes.allContent}>
                <div className={classes.header}>
                    <Button onClick={cancel}>Cancel</Button>
                    <Typography variant={'h5'}>Filters</Typography>
                    <Button onClick={this.reset}>Reset</Button>
                </div>

                {/* Carnivores */}
                {this.getCollapse(classes, "Type of Carnivore", this.toggleShow('showCarnivores'), showCarnivores,
                    <FilterCheckboxes filter={carnivoreFilter} allLabel="All Carnivores" updateValues={this.updateFilter('carnivoreFilter')} briefNumber={allCarnivores.length}/>
                )}

                {/* Neighborhoods */}
                {this.getCollapse(classes, "Neighborhood", this.toggleShow('showNeighborhoods'), showNeighborhoods,
                    <FilterCheckboxes filter={neighborhoodFilter} allLabel="All Neighborhoods" updateValues={this.updateFilter('neighborhoodFilter')} briefNumber={briefNeighborhoodsCount}/>
                )}

                {/* Time and Day */}
                {this.getCollapse(classes, "Time of Sighting", this.toggleShow('showTime'), showTime,
                    <>
                        Date: <DatePicker
                            selected={date}
                            dateFormat="MMMM d, yyyy"
                            onChange={this.handleDateChange}
                        />
                        Time of Day:
                        <FilterCheckboxes filter={timeFilter} allLabel="Any time of day" updateValues={this.updateFilter('timeFilter')} briefNumber={allTimes.length}/>
                    </>
                )}

                {/* Confidence */}
                {this.getCollapse(classes, "Confidence of Sighting", this.toggleShow('showConfidence'), showConfidence,
                    <FormControl component="fieldset">
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox checked={confidenceFilterActive} onChange={this.toggleConfidence} checkedIcon={<CheckBoxIntermediateIcon/>} />}
                                label="Only show high-confidence sightings" />
                        </FormGroup>
                    </FormControl>
                )}
                <Button variant="contained" className={classes.resultsButton} onClick={this.applyFilter}>See Results</Button>
            </div>)
    }
}

export default withStyles(styles)(FilterDrawer);