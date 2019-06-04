import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import DatePicker from 'react-datepicker';
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import 'react-datepicker/dist/react-datepicker.css';
import LoadingOverlay from 'react-loading-overlay';

import MediaUpload from './MediaUpload';
import FormMap from './FormMap';
import NeighborhoodService from '../services/NeighborhoodService';

const addReportUrl = 'https://us-central1-seattlecarnivores-edca2.cloudfunctions.net/addReport';

// Options
const speciesLst = ['Black Bear', 'Bobcat', 'Cougar/Mountain Lion', 'Coyote', 'Opossum',
  'Raccoon', 'River Otter', 'Other/Unknown'];
const confidenceLevels = ['Not at all confident', 'About 25% confident', 'About 50% confident', 'About 75% confident',
  'More than 75% confident', '100% confident'];
const reactions = ['Stayed quiet', 'Shouted/made noise', 'Other'];
const dogSizes = ['Small (up to 20lbs)', 'Medium(20-60lbs)', 'Large(60+lbs)', 'Mixed group'];
const leashOptions = ['Leashed', 'Unleashed', 'Both'];
const animalBehaviors = ['Was eating', 'Urinating', 'Defecating'];
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
const neighborhoodService = new NeighborhoodService();

class Form extends Component {
  state = {
    species: '',
    timestamp: new Date(),
    mapLat: 47.608013,
    mapLng: -122.335167,
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
    thanksMessage: null,
    submitting: false,
    permissionOpen: false,
  };

  constructor(props) {
    super(props);
    this.fileUploader = React.createRef();
  }

  componentDidMount = () => {
    // The neighborhood is initialized to the empty string, but we want to have a neighborhood for our
    // initial location!
    neighborhoodService.getNeighborhoodFor(this.state.mapLat, this.state.mapLng)
      .then(neighborhood => this.setState({neighborhood}));
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  getMapCoordinates = dataFromMap => {
    this.setState({ mapLat: dataFromMap.lat, mapLng: dataFromMap.lng });
    neighborhoodService.getNeighborhoodFor(dataFromMap.lat, dataFromMap.lng)
      .then(neighborhood => this.setState({neighborhood}));
  };

  handleSubmit = () => {
    let {thanksMessage, submitting, permissionOpen, ...report} = this.state;
    delete report['media'];
    this.setState({submitting: true});
    return axios.post(addReportUrl, report)
      .then(response => {
        this.setState({submitting: false});
        if (response.status === 200) {
          this.setState({thanksMessage: THANKS_FOR_SUBMITTING}); // Open the submission recieved dialog
        } else {
          this.setState({thanksMessage: ERROR_ON_SUBMISSION});
        }
      });
  };

  handleUploadSuccess = files => {
    this.setState({ mediaPaths: files });
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
      media.forEach(file => this.fileUploader.startUpload(file));
    }
  };

  handlePermissionResponse = (agree) => {
    this.setState({permissionOpen: false});
    if (agree) {
      this.uploadMedia();
    }
  }

  handleClose = () => {
    const { history, handleDrawerState, fromDrawer } = this.props;
    this.setState({thanksMessage: null}, () => {
      history.push('/');
      if (fromDrawer) {
        handleDrawerState(false);
      }
    });
  }

  render() {
    const {
      mapLat, mapLng, timestamp, animalFeatures, species, confidence, numberOfAdultSpecies,
      numberOfYoungSpecies, numberOfAdults, numberOfChildren, reaction, reactionDescription, numberOfDogs, dogSize,
      onLeash, animalBehavior, animalEating, vocalization, vocalizationDesc, carnivoreResponse, carnivoreConflict,
      conflictDesc, contactName, contactEmail, contactPhone, generalComments, mediaPaths, thanksMessage, submitting,
      permissionOpen, neighborhood
    } = this.state;
    return (
      <LoadingOverlay active={submitting} spinner text='Submitting...'>
      <div>
        <h2>Report a carnivore sighting</h2>
        <ValidatorForm onError={errors => console.log(errors)}
                       onSubmit={this.handleSubmit}
                       className="formWizardBody" autoComplete="off">
          <div className="formItem">
            <h4>When did you see the animal?</h4>
            <DatePicker
              selected={timestamp}
              onChange={this.handleTimestampChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              timeCaption="time"
            />
          </div>

          <div className="formItem">
            <h4>Identify the location of your sighting</h4>
            <p> Drag the point on the map to mark your sighting</p>

            <FormMap passMapCoordinates={this.getMapCoordinates}
                     centerLng={mapLng} centerLat={mapLat}/>
            {mapLat && mapLng ?
              <p>{mapLat.toFixed(6)}, {mapLng.toFixed(6)}</p> : null}
            <p>{neighborhood}</p>
          </div>

          <div className="formItem">
            <h4>Which animal did you see?</h4>
            <SelectValidator
              value={species}
              variant="outlined"
              label="Species"
              style={{ minWidth: '300px' }}
              validators={['required']}
              errorMessages={['this field is required']}
              onChange={this.handleChange}
              inputProps={{
                name: 'species',
                id: 'species',
              }}
            >
              {speciesLst.map((type, idx) => <MenuItem key={idx} value={type}>{type}</MenuItem>)}
            </SelectValidator>
          </div>

          <div className="formItem">
            <h4>What were some key features about the animal(s)? </h4>
            <TextValidator
              label="Describe (limit 80 char)"
              multiline
              style={{ minWidth: '300px', backgroundColor: 'transparent' }}
              validators={['required']}
              errorMessages={['This field is required']}
              rows="4"
              value={animalFeatures}
              inputProps={{
                name: 'animalFeatures',
                id: 'animalFeatures',
                maxLength: 80,
              }}
              onChange={this.handleChange}
              margin="normal"
              variant="outlined"
            />
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

          <div className="formItem">
            <h4>Describe the animal(s) behavior</h4>
            <SelectValidator
              value={animalBehavior}
              style={{ minWidth: '300px' }}
              validators={['required']}
              errorMessages={['This field is required']}
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
                label="Describe (limit 80 char)"
                multiline
                style={{ minWidth: '300px' }}
                validators={['required']}
                errorMessages={['This field is required']}
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
            <h4>Was/were the animal(s) making any noises?</h4>
            <SelectValidator
              value={vocalization}
              style={{ minWidth: '300px' }}
              validators={['required']}
              errorMessages={['This field is required']}
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
            <h4>How did the carnivore respond to you and/or your pets/livestock?</h4>
            <SelectValidator
              value={carnivoreResponse}
              style={{ minWidth: '300px' }}
              validators={['required']}
              errorMessages={['This field is required']}
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
            <h4>Was there an interaction or conflict between you, your pets/livestock or other items and the
              carnivore?</h4>
            <SelectValidator
              style={{ minWidth: '300px' }}
              validators={['required']}
              errorMessages={['This field is required']}
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
                  validators={['required']}
                  errorMessages={['This field is required']}
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


          <div className="formItem">
            <h4>Upload pictures, videos or sound files</h4>
            <MediaUpload uploadMedia={this.setMedia} getMediaPaths={this.handleUploadSuccess}/>
            {mediaPaths.length > 0 ? <p>{mediaPaths.length} files uploaded</p> : null}
          </div>
          {/* Setting permissionOpen to true opens the permission dialog, where clicking "agree" actually calls the media upload function */}
          <Button size="small" color="secondary" variant="contained" onClick={() => this.setState({ permissionOpen: true })}>Upload</Button>

          <div className="formItem">
            <h4>How many humans were in your group?</h4>
            <SelectValidator
              value={numberOfAdults}
              style={{ minWidth: '300px', marginBottom: '15px' }}
              validators={['required']}
              errorMessages={['This field is required']}
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
              validators={['required']}
              errorMessages={['This field is required']}
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
            <h4>How did you react to the species?</h4>
            <SelectValidator
              value={reaction}
              style={{ minWidth: '300px' }}
              validators={['required']}
              errorMessages={['This field is required']}
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
            <h4>Any dog(s) present in your group?</h4>
            <SelectValidator
              value={numberOfDogs}
              select
              style={{ minWidth: '300px' }}
              validators={['required']}
              errorMessages={['This field is required']}
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
                  validators={['required']}
                  errorMessages={['This field is required']}
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
                  validators={['required']}
                  errorMessages={['This field is required']}
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

          <div className="formItem">
            <h4>Contact Information</h4>
            <p> This information will not be shared</p>
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

          <div className="formItem">
            <h4>General Comments</h4>
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
        {/* "Thanks for submitting" dialog */}
        <Dialog
          open={thanksMessage}
          onClose={this.handleClose}
        >
          <DialogContent>
            <DialogContentText>
              {thanksMessage}
            </DialogContentText>
          </DialogContent>
        </Dialog>
        {/* Permission dialog */}
        <Dialog
          open={permissionOpen}
          onClose={() => this.setState({ permissionOpen: false })}
        >
          <DialogContent>
            <DialogContentText>
              Is it ok if we store the images and audio that you've uploaded? If you say no, we will not be able to show your pictures to other users.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handlePermissionResponse(false)} color="primary">
              No, don't use my media
            </Button>
            <Button onClick={() => this.handlePermissionResponse(true)} color="primary">
              Yes, use my media
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      </LoadingOverlay>
    );
  }
}

export default withRouter(Form);
