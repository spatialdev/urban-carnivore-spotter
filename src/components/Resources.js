import React, { Component } from 'react';
import {Collapse, withStyles, Fab} from '@material-ui/core';
import AddIcon from '@material-ui/icons/ArrowDownward';
import RemoveIcon from '@material-ui/icons/ArrowUpward';
import {Link} from "react-router-dom";
import { getDisplayName } from '../services/ColorService';
import {connect} from "react-redux";

const styles = {
    allContentMobile: {
        height: '100%',
        overflow: 'scroll',
        position: 'relative',
        flexDirection: 'column',
        backgroundColor: '#F6F4F3'
    },
    allContentDesktop: {
        paddingTop: 50,
        height: '100%',
        overflow: 'scroll',
        position: 'relative',
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        backgroundColor: 'white',
        zIndex: 1
    },
    expandButton: {
        margin:10,
        boxShadow: 'none',
        float: 'right',
        position: 'relative',
        '& svg': {
            fontSize: 25,
        },
        width: 30,
        height: 30
    },
    expandHeader: {
        margin: 16,
        display: 'flex',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        lineHeight:'50px'

    },
    collapsible: {
        textAlign: 'left',
        lineHeight: '2',
        fontSize: 17
    },
    body: {
        textAlign: 'left',
        margin: 16,
    },

};
const speciesList = ['blackbear', 'bobcat', 'cougar', 'coyote', 'opossum',
    'raccoon', 'riverotter'];

class Resources extends Component {
    constructor(props) {
        super(props);

        // Initialize state
        this.state = {
            showTips: false,
            showProjectDescription: false,
            showContactUs: false,
        };
    }

    getCollapse = (classes, headerTitle, onClick, expand, child) => {
        return <>
            <div className={classes.expandHeader}>
                <span className={classes.headerTitle}>{headerTitle}</span>
                <Fab className={classes.expandButton}
                    onClick={onClick}
                    disableRipple={true}>
                    {expand ? <RemoveIcon /> : <AddIcon />}
                </Fab>
            </div>
            <Collapse in={expand} className={classes.collapsible}>
                {child}
            </Collapse>

        </>
    };

    toggleShow = groupName => () => {
        this.setState(state => ({...state,
            [groupName]: !state[groupName]}));
    };

    render = () => {
        const {showTips, showProjectDescription, showContactUs} = this.state;
        const {classes, isMobile} = this.props;
        return(
            <div className={isMobile? classes.allContentMobile : classes.allContentDesktop}>
                {/* Species Identification Tips */}
                {this.getCollapse(classes, "Species Identification Tips", this.toggleShow('showTips'), showTips,
                    <div className={classes.body}>
                        {speciesList.map((type, idx) =>
                            <li key={idx}>
                                <Link to={`/resources/${type}`}>{getDisplayName(type)}</Link>
                            </li>)
                        }
                    </div>
                )}
                <hr/>

                {/* Seattle Urban Carnivore Project */}
                {this.getCollapse(classes, "Seattle Urban Carnivore Project", this.toggleShow('showProjectDescription'), showProjectDescription,
                    <div className={classes.body}>
                        <p>Seattle Spotter is part of the SeattleUrban Carnivore Project, a collaboration between the Seattle University and WoodlandPark Zoo</p>
                        <a href="https://www.zoo.org/otters">learn more</a>
                    </div>

                )}
                <hr/>

                {/* Contact Us */}
                {this.getCollapse(classes, "Contact Us", this.toggleShow('showContactUs'), showContactUs,
                    <div className={classes.body} >
                        <a href="mailto:seattlecarnivores@zoo.org">seattlecarnivores@zoo.org</a>
                    </div>
                )}
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return { isMobile: state.isMobile };
};

export default (withStyles(styles)(connect(mapStateToProps)(Resources)));
