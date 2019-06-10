import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from "react-redux";
import {Button, withStyles} from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';
import {KeyboardArrowLeft} from "@material-ui/icons";

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
                    <img  className={isMobile? classes.mobileImage : classes.desktopImage} src={ require('../assets/SpeciesCards/' + species+'.png') }/>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return { isMobile: state.isMobile };
};

export default (withRouter(withStyles(styles)(connect(mapStateToProps)(ResourceCard))));