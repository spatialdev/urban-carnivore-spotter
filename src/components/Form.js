import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import DialogContent from '@material-ui/core/DialogContent';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Dialog from '@material-ui/core/Dialog';

import DatePicker from 'react-datepicker';
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import 'react-datepicker/dist/react-datepicker.css';
import LoadingOverlay from 'react-loading-overlay';
import ScrollLock from 'react-scrolllock';

import MediaUpload from './MediaUpload';
import FormMap from './FormMap';
import StaticFormMap from './StaticFormMap'
import MediaDisplay from './MediaDisplay';
import NeighborhoodService from '../services/NeighborhoodService';
import {Collapse, Fab, withStyles} from "@material-ui/core";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Info from '@material-ui/icons/InfoOutlined';
import {connect} from "react-redux";
import { getAllSpecies, getDataForSpecies, getImageBySpecies } from "../services/SpeciesService";
import FormInfoDialog from './FormInfoDialog';
import SpeciesCard from "./SpeciesCardMobile";

const addReportUrl = 'https://us-central1-seattlecarnivores-edca2.cloudfunctions.net/addReport';
// Options
const speciesLst = ['Black Bear', 'Bobcat', 'Cougar/Mountain Lion', 'Coyote', 'Opossum',
  'Raccoon', 'River Otter', 'Other/Unknown'];
const confidenceLevels = ['Not at all confident', 'About 25% confident', 'About 50% confident', 'About 75% confident',
  'More than 75% confident', '100% confident'];
const reactions = ['Stayed quiet', 'Shouted/made noise', 'Other'];
const dogSizes = ['Small (up to 20lbs)', 'Medium(20-60lbs)', 'Large(60+lbs)', 'Mixed group'];
const leashOptions = ['Leashed', 'Unleashed', 'Both'];
const animalBehaviors = ['Was eating', 'Urinated', 'Defecated'];
const vocalizations = ['Barking', 'Howling', 'Growling', 'Other'];
const carnivoreResponses = ['Animal did not seem to notice observer', 'Animal ran away',
  'Animal stood ground-seemed interested in observer', 'Animal stood ground - seemed uninterested in observer',
  'Animal moved towards observer, pets or livestock, and not simply to access an escape route'];
const conflictOptions = ['Animal made physical contact with pet or livestock',
  'Animal made physical contact with human(s)', 'Interacted with human-related item or place (e.g., trash can, birdfeeder, fence/yard, attic)'];
const counts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// constants
const THANKS_FOR_SUBMITTING = 'Thank you for your submission! Please note that the system will display your observation on the map after a period of one week.';
const ERROR_ON_SUBMISSION = 'Something went wrong during your submission. Please try again later.';
const FILES_TOO_LARGE = 'Please choose a set of files to upload that are smaller than 5MB in total.';
const MAX_FILE_SIZE = 5242880; // 5MiB
const neighborhoodService = new NeighborhoodService();
const DIALOG_MODES = {
  THANKS: 'thanks',
  ERROR: 'error',
  LARGE_FILES: 'largeFiles',
  PERMISSION: 'permission',
  CLOSED: 'closed'
};

const styles = {
  allContent: {
    height: '100%',
    overflow: 'scroll',
    position: 'static',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white'
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
  expandButton: {
    boxShadow: 'none',
    position: 'relative',
    top: -8,
    backgroundColor: '#93C838',
    color: 'white',
    alignItems: 'baseline',

  },
  expandHeader: {
    margin: 16,
    justifyContent: 'space-between'
  },
  headerTitle: {
    fontWeight: 'bold',
    alignText: 'center'
  },
  collapsible: {
    margin: 0,
    textAlign: 'center'
  },
  carouselDesktop: {
    width: 400,
    height: 500,
  },
  carouselMobile: {
    minWidth: 160,
    minHeight: 200,
    maxWidth: 320,
    maxHeight: 400
  },
  mobileImage: {
    width: 300,
    height: 389,
  },
  desktopImage: {
    width: 382,
    height: 495
  },
  radioButtonContainerMobile: {
    display: 'flex',
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    paddingLeft: 35,
    paddingRight: 35,
  },
  addButtonContainer: {
    position: 'absolute',
    left: '34%',
    top: '15%',
    zIndex: 0,
  },
  doneButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  interactiveMapContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  interactiveMapInnerContainer: {
    flex: 1,
  }
};

//https://github.com/Hacker0x01/react-datepicker/issues/942#issuecomment-485934975
class CustomDatePickerInput extends Component {
  render = () => <input
    onClick={this.props.onClick}
    value={this.props.value}
    type="text"
    readOnly={true}
  />;
}

class Form extends Component {
  state = {
    species: '',
    timestamp: new Date(),
    mapLat: 47.668733,
    mapLng: -122.354291,
    confidence: '',
    animalFeatures: '',
    numberOfAdultSpecies: '',
    numberOfYoungSpecies: '',
    numberOfAdults: '',
    numberOfChildren: '',
    reaction: '',
    reactionDescription: '',
    numberOfDogs: '',
    dogSize: '',
    onLeash: '',
    animalBehavior: '',
    animalEating: '',
    vocalization: '',
    vocalizationDesc: '',
    carnivoreResponse: '',
    carnivoreConflict: '',
    conflictDesc: '',
    contactEmail: '',
    contactName: '',
    contactPhone: '',
    generalComments: '',
    neighborhood: '',
    media: null,
    mediaPaths: [],
    dialogMode: DIALOG_MODES.CLOSED,
    submitting: false,
    permissionOpen: false,
    showObserverDetails: false,
    showAnimalBehavior: false,
    showContactInformation: false,
    showCarousel: false,
    carouselImageIndex:0,
    editMode: false,
    addMode: false,
    finalMap: true,
    uploading: false
  };

  constructor(props) {
    super(props);
    this.fileUploader = React.createRef();
  }

  updateNeighborhood = (lat, lng) => {
    neighborhoodService.getNeighborhoodFor(lat, lng)
        .then(neighborhood => this.setState((state) => {
          // If the map coordinates have changed, we don't want to update the neighborhood with outdated info!
          if (state.mapLat === lat && state.mapLng === lng) {
            return {neighborhood};
          }
          return {};
        }));
  };

  componentDidMount = () => {
    // The neighborhood is initialized to the empty string, but we want to have a neighborhood for our
    // initial location!

    this.updateNeighborhood(this.state.mapLat, this.state.mapLng);

    // Request the user's geolocation and default to there
    // See https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API for more information
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.getMapCoordinates({lat: position.coords.latitude, lng: position.coords.longitude});
      }, (err) => console.log(err));
    }
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  getMapCoordinates = dataFromMap => {
    this.setState({ mapLat: dataFromMap.lat, mapLng: dataFromMap.lng });
    this.updateNeighborhood(dataFromMap.lat, dataFromMap.lng);
  };

  handleSubmit = () => {
    let {dialogMode, submitting, ...report} = this.state;
    delete report['media'];
    this.setState({submitting: true});
    return axios.post(addReportUrl, report)
      .then(response => {
        this.setState({submitting: false});
        if (response.status === 200) {
          this.setState({dialogMode: DIALOG_MODES.THANKS}); // Open the submission recieved dialog
        } else {
          this.setState({dialogMode: DIALOG_MODES.ERROR});
        }
      });
  };

  handleUploadSuccess = files => {
    this.setState({ mediaPaths: files, media: null, uploading: false });
  };

  handleTimestampChange = timestamp => {
    this.setState({
      timestamp: new Date(timestamp)
    });
  };

  setMedia = (dataFromChild, uploader) => {
    this.fileUploader = uploader;
    this.setState({ media: dataFromChild });
  };

  uploadMedia = () => {
    const { media } = this.state;
    if (media) {
      const totalSize = media.reduce((sum, file) => sum + file.size, 0);
      if (totalSize >= MAX_FILE_SIZE) {
        // Remove files and ask user to upload smaller files
        this.setState({dialogMode: DIALOG_MODES.LARGE_FILES});
      } else {
        this.setState({ uploading: true });
        // Upload the files
        media.forEach(file => this.fileUploader.startUpload(file));
      }
    }
  };

  handlePermissionResponse = (agree) => {
    this.setState({dialogMode: DIALOG_MODES.CLOSED});
    if (agree) {
      this.uploadMedia();
    }
  };

  handleClose = () => {
    const { history, handleDrawerState, fromDrawer } = this.props;
    this.setState({dialogMode: DIALOG_MODES.CLOSED}, () => {
      history.push('/');
      if (fromDrawer) {
        handleDrawerState(false);
      }
    });
  };

  getCollapse = (classes, headerTitle, onClick, expand, child) => {
    return <>
      <div className={classes.expandHeader}>
        <span className={classes.headerTitle}>{headerTitle}</span>
        <Fab
            className={classes.expandButton}
            onClick={onClick}
            size="small"
            disableRipple={true}
        >
          {expand ? <RemoveIcon /> : <AddIcon/>}
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


  openCarousel = (index) => {
    const newIndex = (index === speciesLst.length-1 ? 0: index);
      this.setState({
        showCarousel: true,
        carouselImageIndex: newIndex
      });
  };

  closeCarousel = () => {
    this.setState({
      showCarousel: false,
      carouselImageIndex: 0
    });
  };

  getDialogFromMode = (mode) => {

    switch(mode) {
      case DIALOG_MODES.CLOSED:
        return <FormInfoDialog open={false}/>;
      case DIALOG_MODES.ERROR:
        return <FormInfoDialog
          open={true}
          onClose={this.handleClose}
          message={ERROR_ON_SUBMISSION}/>;
      case DIALOG_MODES.LARGE_FILES:
        return <FormInfoDialog
          open={true}
          onClose={() => this.setState({dialogMode: DIALOG_MODES.CLOSED})}
          message={FILES_TOO_LARGE}/>;
      case DIALOG_MODES.PERMISSION:
        return <FormInfoDialog
          open={true}
          onClose={() => this.setState({dialogMode: DIALOG_MODES.CLOSED})}
          message={"Is it ok if we store the images and audio that you've uploaded? If you say no, we will not be able to show your pictures to other users"}
          noButton={{onClick: () => this.handlePermissionResponse(false), message: "No, don't use my media"}}
          yesButton={{onClick: () => this.handlePermissionResponse(true), message: "Yes, use my media"}}/>;
      case DIALOG_MODES.THANKS:
        return <FormInfoDialog
          open={true}
          onClose={this.handleClose}
          message={THANKS_FOR_SUBMITTING}/>;
      default:
        return null;
    }
  };

  showInteractiveMap = (classes,neighborhood,mapLng,mapLat ) => {
    return (
      <ScrollLock>
        <div className={classes.interactiveMapContainer}>
          <p> Drag the point on the map to mark your sighting</p>
          <div className={classes.interactiveMapInnerContainer}>
            <FormMap passMapCoordinates={this.getMapCoordinates}
                     centerLng={mapLng} centerLat={mapLat} className="interactiveMap"/>
          </div>
          {neighborhood ? <p style={{alignText: 'center'}}>{neighborhood}</p> : null}
          <div className={classes.doneButtonContainer}>
            <Button size="small" color="primary" variant="contained" onClick={() => this.setState({ editMode: true, finalMap: true, addMode: false})}
            > DONE </Button>
          </div>
        </div>
      </ScrollLock>
    )
  };
  renderMap = (classes, isMobile, neighborhood, mapLng, mapLat) => {
    return isMobile ?
        <div className="formItem">
          <h4>Identify the location of your sighting</h4>
          <div className={this.state.finalMap ? '' : 'hiddenDiv'}>
            <StaticFormMap passMapCoordinates={this.getMapCoordinates}
                           centerLng={mapLng} centerLat={mapLat} />
            <div className={classes.addButtonContainer}>
              <Button size="small" color="primary" variant="contained"
                      onClick={() => this.setState({addMode: true})}>EDIT LOCATION</Button>
            </div>
            {neighborhood ? <p style={{alignText: 'center'}}>{neighborhood}</p> : null}
          </div>
        </div> :
        <div className="formItem">
          <h4>Identify the location of your sighting</h4>
          <p> Drag the point on the map to mark your sighting</p>
          <div className={'constantHeightMapContainer'}>
            <FormMap passMapCoordinates={this.getMapCoordinates}
                     centerLng={mapLng} centerLat={mapLat}/>
          </div>
          {neighborhood ? <p>{neighborhood}</p> : null}
        </div>
  };

  render() {
    const {
      mapLat, mapLng, timestamp, confidence, numberOfAdultSpecies,
      numberOfYoungSpecies, numberOfAdults, numberOfChildren, reaction, reactionDescription, numberOfDogs, dogSize,
      onLeash, animalBehavior, animalEating, vocalization, vocalizationDesc, carnivoreResponse, carnivoreConflict, 
      conflictDesc, contactName, contactEmail, contactPhone, generalComments, mediaPaths, media, submitting,
      neighborhood, dialogMode, showObserverDetails, showAnimalBehavior, showContactInformation, uploading, addMode
    } = this.state;
    const {classes, isMobile} = this.props;
    return (
      <LoadingOverlay active={submitting} spinner text='Submitting...'>
        <h2>Report a carnivore sighting</h2>
        <ValidatorForm onError={errors => console.log(errors)}
                       onSubmit={this.handleSubmit}
                       className="formWizardBody" autoComplete="off">
          <div className="formItem">
            <h4>When did you see the animal?</h4>
            {/*See https://github.com/Hacker0x01/react-datepicker/issues/942#issuecomment-485934975 for more information*/}
            <DatePicker
              selected={timestamp}
              onChange={this.handleTimestampChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              timeCaption="time"
              maxDate={new Date()}
              customInput={<CustomDatePickerInput/>}
            />
          </div>
          {this.renderMap(classes, isMobile,neighborhood, mapLng, mapLat)}
          <div className="formItem">
            <Dialog
                open={addMode}
                onClose={() => this.setState({addMode: false})}
            >
              <DialogContent className="interactiveMapContainer" >
                {this.showInteractiveMap(classes,neighborhood,mapLng,mapLat)}
              </DialogContent>
            </Dialog>
          </div>

          {/*Image*/}
          <div className="formItem">
            <h4>Upload pictures, videos or sound files</h4>
            <MediaUpload uploadMedia={this.setMedia} getMediaPaths={this.handleUploadSuccess}/>
            <MediaDisplay filesOnDeck={media}
                          uploading={uploading}
                          uploadedFiles={mediaPaths}
                          removeFiles={() => this.setState({media: null})}/>
          {media && media.length > 0 ?
            // Setting dialogMode to DIALOG_MODES.PERMISSION opens the permission dialog, where clicking "agree" actually calls the media upload function
            <Button size="small" color="secondary" variant="contained" onClick={() => this.setState({ dialogMode: DIALOG_MODES.PERMISSION})}>Confirm Upload</Button>
            : null}
          </div>


          <div className="formItem">
            <h4>Which animal did you see?</h4>
            <Dialog open={this.state.showCarousel} onClose={this.closeCarousel}>
              <DialogContent>
                <Carousel
                        className={isMobile ? classes.carouselMobile : classes.carouselDesktop}
                        useKeyboardArrows={true}
                        selectedItem={this.state.carouselImageIndex}
                        swipeable={true}
                        showThumbs={false}
                        showIndicators={false}
                    >
                  {getAllSpecies().map((type, idx) => {
                    const data = getDataForSpecies(type);
                    return <SpeciesCard key={idx}
                                        speciesName={data.name}
                                        latinName={data.latin}
                                        weight={data.weight}
                                        height={data.height}
                                        diet={data.diet}
                                        identTips={data.ident}
                                        largerThanLab={data.larger}
                                        imagePath={getImageBySpecies(data.shortname)}/>
                  })}
                    </Carousel>
              </DialogContent>
            </Dialog>
              {speciesLst.map((type, idx) =>
                    <span  className={isMobile ? classes.radioButtonContainerMobile : "radioButtonContainer"} key={idx}>
                     <div  >
                    <label >
                      <input
                          type="radio"
                          name="react-tips"
                          value={type}
                          onChange={() => this.setState({species: type})}
                      />
                      {type}
                    </label>
                  </div>
                    <div>
                        <Fab  aria-label="Info" className="infoButton" size="small">
                            <Info onClick={() => this.openCarousel(idx)}/>
                        </Fab>
                    </div>
                  </span>)}
          </div>

          <div className="formItem">
            <h4>How confident are you that you have identified the animal correctly?</h4>
            <SelectValidator
              value={confidence}
              style={{ minWidth: '300px' }}
              validators={['required']}
              errorMessages={['This field is required']}
              variant="outlined"
              label="Confidence"
              onChange={this.handleChange}
              inputProps={{
                name: 'confidence',
                id: 'confidence',
              }}
            >
              {confidenceLevels.map((level, idx) => <MenuItem key={idx} value={level}>{level}</MenuItem>)}
            </SelectValidator>
          </div>

          <div className="formItem">
            <h4>How many of the species did you see?</h4>
            <div>
              <SelectValidator
                value={numberOfAdultSpecies}
                style={{ minWidth: '300px', marginBottom: '15px' }}
                validators={['required']}
                errorMessages={['This field is required']}
                variant="outlined"
                label="Number of Adult"
                onChange={this.handleChange}
                inputProps={{
                  name: 'numberOfAdultSpecies',
                  id: 'numberOfAdultSpecies',
                }}
              >
                {counts.map(idx => <MenuItem key={idx} value={idx}>{idx === 9 ? '9+' : idx.toString()}</MenuItem>)}
              </SelectValidator>
            </div>
            <SelectValidator
              value={numberOfYoungSpecies}
              style={{ minWidth: '300px' }}
              validators={['required']}
              errorMessages={['This field is required']}
              variant="outlined"
              label="Number of Young"
              onChange={this.handleChange}
              inputProps={{
                name: 'numberOfYoungSpecies',
                id: 'numberOfYoungSpecies',
              }}
            >
              {counts.map(idx => <MenuItem key={idx} value={idx}>{idx === 9 ? '9+' : idx.toString()}</MenuItem>)}
            </SelectValidator>
          </div>
          <br/>

          {/*Observer details*/}
          <div className={classes.allContent}>
            {/* Species Identification Tips */}
            {this.getCollapse(classes, "Observer Details (Optional)", this.toggleShow('showObserverDetails'), showObserverDetails,
                <div className={classes.headerTitle}>
                  <div className="formItem">
                    <h4>How many were in your group?</h4>
                    <SelectValidator
                        value={numberOfAdults}
                        style={{ minWidth: '300px', marginBottom: '15px' }}
                        variant="outlined"
                        label="Number of Adults"
                        onChange={this.handleChange}
                        inputProps={{
                          name: 'numberOfAdults',
                          id: 'numberOfAdults',
                        }}
                    >
                      {counts.map(idx => <MenuItem key={idx} value={idx}>{idx === 9 ? '9+' : idx.toString()}</MenuItem>)}
                    </SelectValidator>
                    <p className="childrenAgeText">Children up to 9 years old</p>
                    <SelectValidator
                        value={numberOfChildren}
                        style={{ minWidth: '300px', marginTop: '5px' }}
                        variant="outlined"
                        label="Number of Children"
                        onChange={this.handleChange}
                        inputProps={{
                          name: 'numberOfChildren',
                          id: 'numberOfChildren',
                        }}
                    >
                      {counts.map(idx => <MenuItem key={idx} value={idx}>{idx === 9 ? '9+' : idx.toString()}</MenuItem>)}
                    </SelectValidator>
                  </div>

                  <div className="formItem">
                    <h4>How did you react?</h4>
                    <SelectValidator
                        value={reaction}
                        style={{ minWidth: '300px' }}
                        variant="outlined"
                        label="Reaction"
                        onChange={this.handleChange}
                        inputProps={{
                          name: 'reaction',
                          id: 'reaction',
                        }}
                    >
                      {reactions.map((reaction, idx) => <MenuItem key={idx} value={reaction}>{reaction}</MenuItem>)}
                    </SelectValidator>
                    {reaction === 'Other' ?
                        <TextValidator
                            label="Describe (limit 80 char)"
                            multiline
                            rows="4"
                            value={reactionDescription}
                            inputProps={{
                              name: 'reactionDescription',
                              id: 'reactionDescription',
                              maxLength: 80,
                            }}
                            onChange={this.handleChange}
                            margin="normal"
                            variant="outlined"
                        /> : null}
                  </div>

                  <div className="formItem">
                    <h4>Were there dog(s) present with you / your group?</h4>
                    <SelectValidator
                        value={numberOfDogs}
                        select
                        style={{ minWidth: '300px' }}
                        variant="outlined"
                        label="Number of Dogs"
                        onChange={this.handleChange}
                        inputProps={{
                          name: 'numberOfDogs',
                          id: 'numberOfDogs',
                        }}
                    >
                      {counts.map(idx => <MenuItem key={idx} value={idx}>{idx.toString()}</MenuItem>)}
                    </SelectValidator>
                    {numberOfDogs > 0 ?
                        <div>
                          <SelectValidator
                              value={dogSize}
                              style={{ minWidth: '300px' }}
                              variant="outlined"
                              label="Size of dog(s)"
                              onChange={this.handleChange}
                              inputProps={{
                                name: 'dogSize',
                                id: 'dogSize',
                              }}
                          >
                            {dogSizes.map((size, idx) => <MenuItem key={idx} value={size}>{size}</MenuItem>)}
                          </SelectValidator>
                          <SelectValidator
                              value={onLeash}
                              style={{ minWidth: '300px' }}
                              variant="outlined"
                              label="On Leash"
                              onChange={this.handleChange}
                              inputProps={{
                                name: 'onLeash',
                                id: 'onLeash',
                              }}
                          >
                            {leashOptions.map((option, idx) => <MenuItem key={idx} value={option}>{option}</MenuItem>)}
                          </SelectValidator>
                        </div> : null
                    }
                  </div>
                </div>
            )}
            <hr/>
          </div>
          <br/>
          {/*Animal behavior*/}
          <div className={classes.allContent}>
            {/* Species Identification Tips */}
            {this.getCollapse(classes, "Animal Behavior (Optional)", this.toggleShow('showAnimalBehavior'), showAnimalBehavior,
                <div className={classes.headerTitle}>
                  <div className="formItem">
                    <h4>What was it doing?</h4>
                    <SelectValidator
                        value={animalBehavior}
                        style={{ minWidth: '300px' }}
                        variant="outlined"
                        label="Animal Behavior"
                        onChange={this.handleChange}
                        inputProps={{
                          name: 'animalBehavior',
                          id: 'animalBehavior',
                        }}
                    >
                      {animalBehaviors.map((behavior, idx) => <MenuItem key={idx} value={behavior}>{behavior}</MenuItem>)}
                    </SelectValidator>

                    {animalBehavior === 'Was eating' ?
                        <TextValidator
                            label="What it was eating (if observed):"
                            multiline
                            style={{ minWidth: '300px' }}
                            rows="4"
                            value={animalEating}
                            inputProps={{
                              name: 'animalEating',
                              id: 'animalEating',
                              maxLength: 80
                            }}
                            onChange={this.handleChange}
                            margin="normal"
                            variant="outlined"

                        /> : null
                    }
                  </div>

                  <div className="formItem">
                    <h4>Did it vocalize?</h4>
                    <SelectValidator
                        value={vocalization}
                        style={{ minWidth: '300px' }}
                        variant="outlined"
                        label="Vocalization"
                        onChange={this.handleChange}
                        inputProps={{
                          name: 'vocalization',
                          id: 'vocalization',
                        }}
                    >
                      {vocalizations.map((type, idx) => <MenuItem key={idx} value={type}>{type}</MenuItem>)}
                    </SelectValidator>

                    {vocalization === 'Other' ?
                        <TextValidator
                            label="Describe (limit 80 char)"
                            multiline
                            required
                            rows="4"
                            value={vocalizationDesc}
                            inputProps={{
                              name: 'vocalizationDesc',
                              id: 'vocalizationDesc',
                              maxLength: 80
                            }}
                            onChange={this.handleChange}
                            margin="normal"
                            variant="outlined"

                        /> : null
                    }
                  </div>

                  <div className="formItem" id="carnivoreResponse">
                    <h4>How did it react?</h4>
                    <SelectValidator
                        value={carnivoreResponse}
                        style={{ minWidth: '300px' }}
                        variant="outlined"
                        label="Carnivore Response"
                        onChange={this.handleChange}
                        inputProps={{
                          name: 'carnivoreResponse',
                          id: 'carnivoreResponse',
                        }}
                    >
                      {carnivoreResponses.map((type, idx) =>
                          <MenuItem
                              style={{ whiteSpace: 'normal', marginBottom: '10px' }}
                              key={idx}
                              value={type}>{type}</MenuItem>)}
                    </SelectValidator>
                  </div>
                  <div className="formItem" id="carnivoreConflict">
                    <h4>Was there an interaction with the observer, pets/livestock or other items?</h4>
                    <SelectValidator
                        style={{ minWidth: '300px' }}
                        value={carnivoreConflict}
                        variant="outlined"
                        label="Carnivore Conflict"
                        onChange={this.handleChange}
                        inputProps={{
                          name: 'carnivoreConflict',
                          id: 'carnivoreConflict',
                        }}
                    >
                      {conflictOptions.map((type, idx) =>
                          <MenuItem
                              style={{ whiteSpace: 'normal', marginBottom: '10px' }}
                              key={idx}
                              value={type}>{type}</MenuItem>)}
                    </SelectValidator>

                    {
                      conflictOptions.indexOf(carnivoreConflict) === 0 || conflictOptions.indexOf(carnivoreConflict) === 2 ?
                          <TextValidator
                              label="Describe (limit 80 char)"
                              multiline
                              style={{ minWidth: '300px' }}
                              rows="4"
                              value={conflictDesc}
                              inputProps={{
                                name: 'conflictDesc',
                                id: 'conflictDesc',
                                maxLength: 80
                              }}
                              onChange={this.handleChange}
                              margin="normal"
                              variant="outlined"
                          /> : null

                    }
                  </div>

                </div>
            )}
            <hr/>
          </div>
          <br/>

          {/*Contact*/}
          <div className={classes.allContent}>
            {/* Species Identification Tips */}
            {this.getCollapse(classes, "Contact Information (Optional)", this.toggleShow('showContactInformation'), showContactInformation,
                <div className={classes.headerTitle}>
                  <div className="formItem">
                    <p> This information will not be shared and will be available to project coordinators only.</p>
                    <div>
                      <TextValidator
                          value={contactName}
                          style={{ minWidth: '300px', marginBottom: '15px' }}
                          variant="outlined"
                          label="Name"
                          onChange={this.handleChange}
                          inputProps={{
                            name: 'contactName',
                            id: 'contactName',
                          }}
                      >
                      </TextValidator>
                    </div>
                    <div>
                      <TextValidator
                          value={contactEmail}
                          variant="outlined"
                          label="Email"
                          style={{ minWidth: '300px', marginBottom: '15px' }}
                          onChange={this.handleChange}
                          validators={['isEmail']}
                          errorMessages={['Email is not valid']}
                          inputProps={{
                            name: 'contactEmail',
                            id: 'contactEmail',
                          }}
                      >
                      </TextValidator>
                    </div>
                    <TextValidator
                        value={contactPhone}
                        variant="outlined"
                        label="Phone Number"
                        style={{ minWidth: '300px' }}
                        onChange={this.handleChange}
                        inputProps={{
                          name: 'contactPhone',
                          id: 'contactPhone',
                        }}
                    >
                    </TextValidator>
                  </div>
                </div>
            )}
            <hr/>
          </div>
          <br/>

          <div className="formItem">
            <h4>Comments (Optional)</h4>
            <TextValidator
              value={generalComments}
              style={{ minWidth: '300px' }}
              variant="outlined"
              label="General Comments"
              onChange={this.handleChange}
              inputProps={{
                name: 'generalComments',
                id: 'generalComments',
              }}
            >
            </TextValidator>
          </div>
          <Button variant="contained" type="submit" color="primary">
            Submit
          </Button>
        </ValidatorForm>
        {this.getDialogFromMode(dialogMode)}
      </LoadingOverlay>
    );
  }
}

const mapStateToProps = (state) => {
  return { isMobile: state.isMobile };
};

export default withRouter(withStyles(styles)(connect(mapStateToProps)(Form)));
