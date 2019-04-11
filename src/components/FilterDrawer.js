import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Button, Collapse } from '@material-ui/core';
import FilterCheckboxes from './FilterCheckboxes';

const styles = {
    allContent: {},
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    filterBox: {},
    resultsButton: {
        width: '100%'
    },
    filterCheckboxItem: {
        margin: '0 !important'
    }
}

const allCarnivores = ['Bears', 'Bobcats', 'Coyotes', 'Mountain Lions', 'Racoons', 'Other'];
const allNeighborhoods = ['Ballard', 'Beacon Hill', 'Bothell', 'Broadview', 'Burien', 'Capitol Hill', 'Chinatown', 'Downtown'] // and more...
const briefNeighborhoodsCount = 5;

class FilterDrawer extends React.Component {

    constructor(props) {
        super(props);
        
        // Initialize carnivore and neighborhood state
        const defaultCarnivoreFilter = {};
        allCarnivores.forEach(carnivore => defaultCarnivoreFilter[carnivore] = false);
        const defaultNeighborhoodFilter = {};
        allNeighborhoods.forEach(neighborhood => defaultNeighborhoodFilter[neighborhood] = false);
        this.state = {
            carnivoreFilter: defaultCarnivoreFilter,
            neighborhoodFilter: defaultNeighborhoodFilter,
            showCarnivores: false,
            showNeighborhoods: false
        }
    }

    setCarnivores = (carnivores) => {
        this.setState(state => ({...state,
            carnivoreFilter: carnivores}));
    }

    setNeighborhoods = (neighborhoods) => {
        this.setState(state => ({...state,
            neighborhoodFilter: neighborhoods}));
    }

    showCarnivores = () => {
        this.setState(state => ({...state,
            showCarnivores: !state.showCarnivores}));
    }

    showNeighborhoods = () => {
        this.setState(state => ({...state,
            showNeighborhoods: !state.showNeighborhoods}));
    }

    render() {
        const {classes} = this.props;
        const {showCarnivores, showNeighborhoods} = this.state;
        return (
            <div className={classes.allContent}>
                <div className={classes.header}>
                    <Button>Cancel</Button>
                    <Typography variant={'h5'}>Filters</Typography>
                    <Button>Reset</Button>
                </div>
                Type of Carnivore <Button onClick={this.showCarnivores}>+</Button>
                <Collapse in={showCarnivores}>
                    <FilterCheckboxes allItems={allCarnivores} allLabel="All Carnivores" updateValues={this.setCarnivores} briefNumber={allCarnivores.length}/>
                </Collapse>
                Neighborhood <Button onClick={this.showNeighborhoods}>+</Button>
                <Collapse in={showNeighborhoods}>
                    <FilterCheckboxes allItems={allNeighborhoods} allLabel="All Neighborhoods" updateValues={this.setNeighborhoods} briefNumber={briefNeighborhoodsCount}/>
                </Collapse>
                <div>Time of Sighting</div>
                <Button className={classes.resultsButton}>See Results</Button>
            </div>)
    }
}

export default withStyles(styles)(FilterDrawer);