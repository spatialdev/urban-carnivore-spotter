import React, { Component } from 'react';
import ReactMapboxGl, {Layer, Feature, Popup} from 'react-mapbox-gl';
import axios from "axios";
import PointTooltip from '../components/PointTooltip';
import FilterDrawer from './FilterDrawer';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { dataMatchesFilter } from '../services/FilterService';
import { getColorForSpecies } from '../services/ColorService';
import NavigationIcon from '@material-ui/icons/Navigation';
import Fab from '@material-ui/core/Fab';
import List from "@material-ui/icons/List";
import Help from "@material-ui/icons/HelpOutline";
import {withRouter} from "react-router-dom";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import { speciesColorMap } from '../services/ColorService';
import Button from "@material-ui/core/Button";
import AddIcon from '@material-ui/icons/Add';

const Map2 = ReactMapboxGl({
    accessToken: process.env.REACT_APP_MAPBOX_TOKEN
});

const getReports = "https://us-central1-seattlecarnivores-edca2.cloudfunctions.net/getReports";

const styles = {
    filterContainer: {
        backgroundColor: 'white',
        position: 'fixed',
        left: '5%',
        bottom: '5%',
        width: 250,
        zIndex: 1,
        height: '60%',
        boxShadow: '2px 2px 2px'
    },
    buttonContainerMobile: {
        left: '87%',
        position: 'fixed',
        bottom: '25%'
    },
    buttonContainerDesktop: {
        right: '3%',
        position: 'fixed',
        bottom: '5vh'
    },

    legendMobileContainer: {
        top: '24vh',
        left: '87%',
        position: 'fixed',
        backgroundColor: '#FFFFFF'
    },
    legendDesktopContainer: {
        top: '24vh',
        right: '3%',
        position: 'fixed',
        backgroundColor: '#FFFFFF'
    },
    legendButtonMobile:{
        '& svg': {
            fontSize: 20,
        },
        width: 20,
        height: 20,
        backgroundColor: '#FFFFFF'
    },
    navigationButton: {
        '& svg': {
            fontSize: 20,
        },
        width: 20,
        height: 20,
        backgroundColor: '#FFFFFF'
    },
    navigationButtonContainer: {
        width: 35,
        height: 35,
        backgroundColor: '#FFFFFF',
        "&:hover": {
            backgroundColor: "#FFFFFF"
        }
    },
    listViewButton: {
        '& svg': {
            fontSize: 20,
        },
        width: 20,
        height: 20,
        backgroundColor: '#FFFFFF'
    },
    fab: {
        margin: 1,
        backgroundColor: '#FFFFFF'
    },
    extendedIcon: {
        marginRight: 1,
    },
    listViewMobileWrapper: {
        top: '15vh',
        left: '87%',
        position: 'fixed',
        backgroundColor: '#FFFFFF',
        '& svg': {
            fontSize: 20,
        },
    },
    listViewDesktopWrapper: {
        top: '15vh',
        right: '3%',
        position: 'fixed',

        '& svg': {
            fontSize: 30,
        },
    },
};
class MapView extends Component {
    state = {
        viewport: {
            center: [-122.335167, 47.608013],
            zoom: [10],
        },
        popupInfo: null,
        reports: null,
        legend: false
    };

    componentDidMount() {
        const url = getReports+"?mapLat=47.608013&mapLng=-122.335167";
        axios.get(url)
            .then(reports => {
                this.setState({ reports: reports.data});
            })
            .catch(error => error);
    }

    onMoveEnd = (map) => {
        const center = map.getCenter();
        const zoom = map.getZoom();
        this.setState({viewport: {center: [center.lng, center.lat], zoom: [zoom]}});
        const url = getReports+"?mapLat="+center.lat+"&mapLng="+center.lng;
        axios.get(url)
            .then(reports => {
                reports.data!=="No data!" ? this.setState({ reports: reports.data}):
                    this.setState({reports: null})
            })
            .catch(error => error);

    };

    renderPopup() {
        const {popupInfo} = this.state;
        if(popupInfo)
        {
            return <Popup
                    coordinates={[popupInfo.data.mapLng, popupInfo.data.mapLat]}
                    onClick={() => this.setState({popupInfo: false})}
                    anchor={"bottom"}
            >
                <PointTooltip report={popupInfo} />
            </Popup>
        }
    }

    handleClose = () => {
        const { history} = this.props;
        this.setState({legend: false}, () => {
            history.push('/');})
    };

    showLegend = () => {
        return speciesColorMap.entrySeq().map( ([key, value]) =>
            <div key={key}  >
                <span style={{background:value}} className="dot">
                </span>
                <label  key={key} className="label"> {key} </label>
            </div>

        );
    };

    updateLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.setState({viewport: {
                        center: [position.coords.longitude, position.coords.latitude],
                        zoom: [10],
                    }});
            }, (err) => console.log(err));
        }
        else {
            this.setState({viewport: {
                    center: [-122.354291, 47.668733],
                    zoom: [10],
                }})
        }
    };

    showReportSightings = (isMobile, isOnExplore, classes, history) => {
        if(!isMobile)
        {
            return<Button variant="contained" color="primary" className="reportSightingButton" onClick={() => {history.push('/reports/create');
            this.setState({isOnExplore: false})}} >
                    Report Sightings
                    <AddIcon />
                </Button>;

        }
    };

    showListViewButton = (isMobile, isOnExplore, classes, history) => {
        return isMobile ?         <div>
            <Fab className = {classes.listViewMobileWrapper} aria-label="Toggle"  size="small"  >
                <List className = {classes.listViewButton} onClick={() => {history.push('/list');
                this.setState({isOnExplore: false})}}/>
            </Fab>
        </div> : <div className = {classes.listViewDesktopWrapper}>
            <Fab variant="extended" aria-label="Toggle" className={classes.fab} size="medium">
                <List className={classes.extendedIcon} onClick={() => {history.push('/list');
                    this.setState({isOnExplore: false})}}/>
                List View
            </Fab>
        </div>
    };

    render() {
        const {classes, isMobile, isOnExplore, filter,history} = this.props;
        const {reports,legend,viewport} = this.state;
        return (
            <div className="mapContainer">
                { !isMobile && <div className={classes.filterContainer}>
                    <FilterDrawer/>
                </div>}
                <Map2 style="mapbox://styles/mapbox/streets-v9"
                      className="map"
                      center={viewport.center}
                      zoom={viewport.zoom}
                      onMoveEnd={e => this.onMoveEnd(e)}
                >
                    {this.renderPopup()}
                    {reports ? reports.filter(report => dataMatchesFilter(report, filter))
                        .map(report => (
                            <Layer type="circle"
                                key ={report.id}
                                paint={{'circle-color': getColorForSpecies(report.data.species.toLowerCase())}}>
                                <Feature  key ={report.id} coordinates={[report.data.mapLng, report.data.mapLat]}
                                        onClick={() => this.setState({popupInfo: report})}
                                />
                            </Layer>)) : null}
                    {this.showReportSightings(isMobile, isOnExplore, classes, history)}
                    <div>
                        <Fab className = {isMobile? classes.legendMobileContainer : classes.legendDesktopContainer} aria-label = "Legend"  size="small">
                            <Help  onClick = {() => this.setState({legend: true})}/>
                        </Fab>
                    </div>
                    <div className = {isMobile? classes.buttonContainerMobile : classes.buttonContainerDesktop}>
                        <div>
                            <Fab  className = {classes.navigationButtonContainer} aria-label = "Navigation" size = "small">
                                <NavigationIcon className = {classes.navigationButton} onClick={() => this.updateLocation()}/>
                            </Fab>
                        </div>
                    </div>
                    {this.showListViewButton(isMobile, isOnExplore, classes, history)}
                    <div >
                        <Dialog
                            open={legend}
                            onClose={this.handleClose}
                            className="two-col-special"
                        >
                            <DialogContent  >
                                <div >
                                    {this.showLegend()}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </Map2>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isMobile: state.isMobile,
        filter: state.filter,
        isOnExplore: state.isOnExplore
    };
};
export default withRouter(connect(mapStateToProps)(withStyles(styles)(MapView)));
