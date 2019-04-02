import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import MediaUpload from './MediaUpload';
import FormMap from './FormMap';


const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 200,
    backgroundColor: 'white',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    backgroundColor: 'white',
  },
});

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
const counts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];


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
  };

  handleChange = event => {
    console.log(event.target.name);
    this.setState({ [event.target.name]: event.target.value });
  };

  getMapCoordinates = dataFromMap => {
    this.setState({ mapLat: dataFromMap.lat, mapLng: dataFromMap.lng });
  };

  handleTimestampChange = timestamp => {
    this.setState({
      timestamp: new Date(timestamp)
    });
  };

  render() {
    const { classes } = this.props;
    const {
      mapLat, mapLng, timestamp, animalFeatures, species, confidence, numberOfAdultSpecies,
      numberOfYoungSpecies, numberOfAdults, numberOfChildren, reaction, reactionDescription, numberOfDogs, dogSize,
      onLeash, animalBehavior, animalEating, vocalization, vocalizationDesc, carnivoreResponse,
    } = this.state;

    return (
      <form className="formWizardBody" autoComplete="off">

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
        </div>

        <div className="formItem">
          <h4>Which animal did you see?</h4>
          <FormControl className={classes.formControl}>
            <TextField
              value={species}
              select
              variant="outlined"
              label="Species"
              onChange={this.handleChange}
              inputProps={{
                name: 'species',
                id: 'species',
              }}
            >
              {speciesLst.map((type, idx) => <MenuItem key={idx} value={type}>{type}</MenuItem>)}
            </TextField>
          </FormControl>
        </div>

        <div className="formItem">
          <h4>What were some key features about the animal(s)? </h4>
          <TextField
            label="Describe (limit 80 char)"
            multiline
            rows="4"
            value={animalFeatures}
            inputProps={{
              name: 'animalFeatures',
              id: 'animalFeatures',
              maxLength: 80,
            }}
            onChange={this.handleChange}
            className={classes.textField}
            margin="normal"
            variant="outlined"
          />

        </div>

        <div className="formItem">
          <h4>How confident are you that you have identified the animal correctly?</h4>
          <FormControl className={classes.formControl}>
            <TextField
              value={confidence}
              select
              variant="outlined"
              label="Confidence"
              onChange={this.handleChange}
              inputProps={{
                name: 'confidence',
                id: 'confidence',
              }}
            >
              {confidenceLevels.map((level, idx) => <MenuItem key={idx} value={level}>{level}</MenuItem>)}
            </TextField>
          </FormControl>
        </div>

        <div className="formItem">
          <h4>How many of the species did you see?</h4>
          <FormControl className={classes.formControl}>
            <TextField
              value={numberOfAdultSpecies}
              select
              variant="outlined"
              label="Number of Adult"
              onChange={this.handleChange}
              inputProps={{
                name: 'numberOfAdultSpecies',
                id: 'numberOfAdultSpecies',
              }}
            >
              {counts.map(idx => <MenuItem key={idx} value={idx}>{idx === 9 ? '9+' : idx}</MenuItem>)}
            </TextField>
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              value={numberOfYoungSpecies}
              select
              variant="outlined"
              label="Number of Young"
              onChange={this.handleChange}
              inputProps={{
                name: 'numberOfYoungSpecies',
                id: 'numberOfYoungSpecies',
              }}
            >
              {counts.map(idx => <MenuItem key={idx} value={idx}>{idx === 9 ? '9+' : idx}</MenuItem>)}
            </TextField>
          </FormControl>
        </div>

        <div className="formItem">
          <h4>Describe the animal(s) behavior</h4>
          <FormControl className={classes.formControl}>
            <TextField
              value={animalBehavior}
              select
              variant="outlined"
              label="Animal Behavior"
              onChange={this.handleChange}
              inputProps={{
                name: 'animalBehavior',
                id: 'animalBehavior',
              }}
            >
              {animalBehaviors.map((behavior, idx) => <MenuItem key={idx} value={behavior}>{behavior}</MenuItem>)}
            </TextField>
          </FormControl>

          {animalBehavior === 'Was eating' ?
            <TextField
              label="Describe (limit 80 char)"
              multiline
              rows="4"
              value={animalEating}
              inputProps={{
                name: 'animalEating',
                id: 'animalEating',
                maxLength: 80
              }}
              onChange={this.handleChange}
              className={classes.textField}
              margin="normal"
              variant="outlined"

            /> : null
          }
        </div>

        <div className="formItem">
          <h4>Was/were the animal(s) making any noises?</h4>
          <FormControl className={classes.formControl}>
            <TextField
              value={vocalization}
              select
              variant="outlined"
              label="Vocalization"
              onChange={this.handleChange}
              inputProps={{
                name: 'vocalization',
                id: 'vocalization',
              }}
            >
              {vocalizations.map((type, idx) => <MenuItem key={idx} value={type}>{type}</MenuItem>)}
            </TextField>
          </FormControl>

          {vocalization === 'Other' ?
            <TextField
              label="Describe (limit 80 char)"
              multiline
              rows="4"
              value={vocalizationDesc}
              inputProps={{
                name: 'vocalizationDesc',
                id: 'vocalizationDesc',
                maxLength: 80
              }}
              onChange={this.handleChange}
              className={classes.textField}
              margin="normal"
              variant="outlined"

            /> : null
          }
        </div>

        <div className="formItem" id="carnivoreResponse">
          <h4>How did the carnivore respond to you and/or your pets/livestock?</h4>
          <FormControl className={classes.formControl}>
            <TextField
              style={{ maxWidth: '200px' }}
              value={carnivoreResponse}
              select
              variant="outlined"
              label="Carnivore Response"
              onChange={this.handleChange}
              inputProps={{
                name: 'carnivoreResponse',
                id: 'carnivoreResponse',
              }}
            >
              {carnivoreResponses.map((type, idx) => <MenuItem
                style={{ whiteSpace: 'normal', marginBottom: '10px' }}
                key={idx}
                value={type}>{type}</MenuItem>)}
            </TextField>
          </FormControl>
        </div>


        <div className="formItem">
          <h4>Upload pictures, videos or sound files</h4>
          <MediaUpload/>
        </div>

        <div className="formItem">
          <h4>How many humans were in your group?</h4>
          <FormControl className={classes.formControl}>
            <TextField
              value={numberOfAdults}
              select
              variant="outlined"
              label="Number of Adults"
              onChange={this.handleChange}
              inputProps={{
                name: 'numberOfAdults',
                id: 'numberOfAdults',
              }}
            >
              {counts.map(idx => <MenuItem key={idx} value={idx}>{idx === 9 ? '9+' : idx}</MenuItem>)}
            </TextField>
          </FormControl>

          <p className="childrenAgeText">Children up to 9 years old</p>
          <FormControl className={classes.formControl}>
            <TextField
              value={numberOfChildren}
              select
              variant="outlined"
              label="Number of Children"
              onChange={this.handleChange}
              inputProps={{
                name: 'numberOfChildren',
                id: 'numberOfChildren',
              }}
            >
              {counts.map(idx => <MenuItem key={idx} value={idx}>{idx === 9 ? '9+' : idx}</MenuItem>)}
            </TextField>
          </FormControl>
        </div>

        <div className="formItem">
          <h4>How did you react to the species?</h4>
          <FormControl className={classes.formControl}>
            <TextField
              value={reaction}
              select
              variant="outlined"
              label="Reaction"
              onChange={this.handleChange}
              inputProps={{
                name: 'reaction',
                id: 'reaction',
              }}
            >
              {reactions.map((reaction, idx) => <MenuItem key={idx} value={reaction}>{reaction}</MenuItem>)}
            </TextField>
          </FormControl>
          {reaction === 'Other' ?
            <TextField
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
              className={classes.textField}
              margin="normal"
              variant="outlined"
            /> : null}
        </div>

        <div className="formItem">
          <h4>Any dog(s) present in your group?</h4>
          <FormControl className={classes.formControl}>
            <TextField
              value={numberOfDogs}
              select
              variant="outlined"
              label="Number of Dogs"
              onChange={this.handleChange}
              inputProps={{
                name: 'numberOfDogs',
                id: 'numberOfDogs',
              }}
            >
              {counts.map(idx => <MenuItem key={idx} value={idx}>{idx}</MenuItem>)}
            </TextField>
          </FormControl>

          <FormControl className={classes.formControl}>
            <TextField
              value={dogSize}
              select
              variant="outlined"
              label="Size of dog(s)"
              onChange={this.handleChange}
              inputProps={{
                name: 'dogSize',
                id: 'dogSize',
              }}
            >
              {dogSizes.map((size, idx) => <MenuItem key={idx} value={size}>{size}</MenuItem>)}
            </TextField>
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              value={onLeash}
              select
              variant="outlined"
              label="On Leash"
              onChange={this.handleChange}
              inputProps={{
                name: 'onLeash',
                id: 'onLeash',
              }}
            >
              {leashOptions.map((option, idx) => <MenuItem key={idx} value={option}>{option}</MenuItem>)}
            </TextField>
          </FormControl>
        </div>


      </form>
    );
  }
}

Form.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Form);