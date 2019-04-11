import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';

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
    }
}

const allCarnivores = ['Bears', 'Bobcats', 'Coyotes', 'Mountain Lions', 'Racoons', 'Other'];
const allNeighborhoods = ['Ballard', 'Beacon Hill', 'Bothell', 'Broadview', 'Burien', 'Capitol Hill', 'Chinatown', 'Downtown'] // and more...
const briefNeighborhoodsCount = 5;

class FilterDrawer extends React.Component {
    // TODO state might be best stored differently
    state = {
        carnivoreFilter: {},
        neighborhoodFilter:  {}
    }

    componentDidMount() {
        const defaultCarnivoreFilter = {};
        allCarnivores.forEach(carnivore => defaultCarnivoreFilter[carnivore] = true);
        console.log(allCarnivores);
        console.log(defaultCarnivoreFilter);
        this.setState({
            carnivoreFilter: defaultCarnivoreFilter,
            ...this.state})
        console.log(this.state.carnivoreFilter);
        }
    render() {
        const {classes} = this.props;
        console.log(this.state);
        return (
            <div className={classes.allContent}>
                <div className={classes.header}>
                    <Button>Cancel</Button>
                    <Typography variant={'h5'}>Filters</Typography>
                    <Button>Reset</Button>
                </div>
                <div>{allCarnivores.map(carnivore => {
                    return <div>
                        <Checkbox key={carnivore} checked={this.state.carnivoreFilter[carnivore]} onChange={()=>{}} value={carnivore}/>{carnivore}<br/>
                        </div>;
                })}</div>
                <div>Neighborhood</div>
                <div>Time of Sighting</div>
                <Button className={classes.resultsButton}>See Results</Button>
            </div>)
    }
}

export default withStyles(styles)(FilterDrawer);