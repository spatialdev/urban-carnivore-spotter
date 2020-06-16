import React, { Component } from 'react';
import {Collapse, withStyles, Fab} from '@material-ui/core';
import AddIcon from '@material-ui/icons/ArrowDownward';
import RemoveIcon from '@material-ui/icons/ArrowUpward';
import {Link} from "react-router-dom";
import { getDisplayName } from '../services/ColorService';
import {connect} from "react-redux";
import ResourcesDesktop from './ResourcesDesktop';
import {updateMobileResourceExpands} from "../store/actions";
import * as ReactGA from "react-ga";

const styles = {
    allContentMobile: {
        minHeight: '100vh',
        overflow: 'scroll',
        position: 'relative',
        flexDirection: 'column',
        backgroundColor: '#F6F4F3'
    },
    allContentDesktop: {
        paddingTop: 50,
        minHeight: '100vh',
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
        width: 35,
        height: 30
    },
    expandHeader: {
        margin: 16,
        display: 'flex',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        lineHeight:'50px',
        maxWidth: '250px',
        justifyContent: 'left',
        textAlign:'left'
    },
    collapsible: {
        textAlign: 'left',
        lineHeight: '2',
        fontSize: 17
    },
    body: {
        margin: 16,
        textAlign: 'left'
    },
};
const speciesList = ['blackbear', 'bobcat', 'cougar', 'coyote', 'opossum',
    'raccoon', 'riverotter', 'fox'];

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
    componentDidMount() {
        ReactGA.pageview(window.location.pathname);
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
        const {showExpands} = this.props;
        updateMobileResourceExpands({...showExpands,
            [groupName]: !showExpands[groupName]});
    };

    render = () => {
        const {classes, isMobile, showExpands: {showTips, showProjectDescription, showContactUs}} = this.props;
        if (!isMobile) {
            return <ResourcesDesktop/>;
        }
        return(
            <div className={isMobile? classes.allContentMobile : classes.allContentDesktop}>
                {/* Species Identification Tips */}
                {this.getCollapse(classes, "Species Identification Tips", this.toggleShow('showTips'), showTips,
                    <div className={classes.body}>
                        {speciesList.map((type, idx) =>
                            <li key={idx}>
                                <Link to={window.location.pathname.indexOf('tacoma')===-1 ? `/resources/${type}` : `/tacoma/resources/${type}`}>{getDisplayName(type)}</Link>
                            </li>)
                        }
                    </div>
                )}
                <hr/>

                {/* Seattle Urban Carnivore Project */}

                {this.getCollapse(classes, window.location.pathname.indexOf('tacoma')===-1 ? "Seattle Urban Carnivore Project and Grit City Carnivore Project": "Grit City Carnivore Project and Seattle Urban Carnivore Project", this.toggleShow('showProjectDescription'), showProjectDescription,


          <div className={classes.body}>
            <p>Carnivore Spotter was developed by Woodland Park Zoo and Seattle University and is a component of both the
              <a href="https://www.zoo.org/seattlecarnivores"> Seattle Urban Carnivore Project</a>
               and the <a href="https://gritcitycarnivores.org/">Grit City Carnivore Project</a>. Together we're studying carnivores throughout the Puget Sound region as part of the Urban Wildlife Information Network. </p>
              {window.location.pathname.indexOf('tacoma')===-1 ? <a href="https://www.zoo.org/carnivorespotter">Seattle Urban Carnivore Project - learn more</a> : <a href="https://gritcitycarnivores.org/">Grit City Carnivore Project - learn more</a> }
        </div>

                )}
                <hr/>

                {/* Contact Us */}
                { window.location.pathname.indexOf('tacoma')===-1? this.getCollapse(classes, "Contact Us", this.toggleShow('showContactUs'), showContactUs,
                    <div className={classes.body} >
                        <a href="mailto:seattlecarnivores@zoo.org">seattlecarnivores@zoo.org</a>
                    </div>
                ): this.getCollapse(classes, "Contact Us", this.toggleShow('showContactUs'), showContactUs,
                    <div className={classes.body} >
                        <a href="https://gritcitycarnivores.org">Grit City Carnivore Project</a>
                    </div>)}
                <hr/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isMobile: state.isMobile,
        showExpands: state.mobileResourceExpands
    };
};

export default (withStyles(styles)(connect(mapStateToProps)(Resources)));
