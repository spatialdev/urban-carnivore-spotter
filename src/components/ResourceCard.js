import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from "react-redux";
import {Button, withStyles} from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';
import {KeyboardArrowLeft} from "@material-ui/icons";
import SpeciesCard from './SpeciesCard';

const styles = {
    mobileImage: {
        width: 400,
        height: 500,
        paddingLeft: 0,
        paddingRight: 20
    },
    desktopImage: {
        width: 400,
        height: 500
    },
    mobileButton: {
        zIndex: 99,
        alignItems: 'left',
        textAlign: 'left'
    },
    mobileImageContainer: {
        paddingLeft: 10,
        paddingRight: 20
    },

    desktopImageContainer: {
        paddingLeft: 10,
        paddingRight: 20
    }

};
class ResourceCard extends Component {
    state = {
        species: null
    };

    componentDidMount() {
        const { match: { params: { species } } } = this.props;
            this.setState({species: species})
    }
;
    render() {
        const {species} = this.state;
        const { history, isMobile, classes } = this.props;
        if (!species) {
            return <CircularProgress/>;
        }
        return (
            <div>
                <div className={classes.mobileButton}>
                    <Button className="backToExplore" onClick={() => history.goBack()}> <KeyboardArrowLeft/>Back</Button>
                </div>
                <div className={isMobile? classes.mobileImageContainer : classes.desktopImageContainer}>
                    <SpeciesCard speciesName={species}
                                 latinName={'latin name'}
                                 weight={'120-140 lbs / 60-70 kg'}
                                 height={'12-13 in / 100-200 cm'}
                                 diet={'Mostly food (edible things)'}
                                 identTips={'Looks like an animal, honestly'}
                                 largerThanLab={true}/>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return { isMobile: state.isMobile };
};

export default (withRouter(withStyles(styles)(connect(mapStateToProps)(ResourceCard))));