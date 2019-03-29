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
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

const species = ['Black Bear', 'Bobcat', 'Cougar/Mountain Lion', 'Coyote', 'Opossum', 'Raccoon', 'River Otter'];

class Form extends Component {
  state = {
    species: '',
    timestamp: new Date(),
    mapLat: 47.608013,
    mapLng: -122.335167,
  };

  handleChange = event => {
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
    const { mapLat, mapLng, timestamp } = this.state;

    return (
      <form className="formWizardBody" autoComplete="off">
        <div className="formItem">
          <h4>Which animal did you see?</h4>
          <FormControl className={classes.formControl}>
            <TextField
              value={this.state.species}
              select
              variant="outlined"
              label="Species"
              onChange={this.handleChange}
              inputProps={{
                name: 'species',
                id: 'species',
              }}
            >
              {species.map((type, idx) => <MenuItem key={idx} value={type}>{type}</MenuItem>)}
            </TextField>
          </FormControl>
        </div>

        <div className="formItem">
          <h4>Upload pictures, videos or sound files</h4>
          <MediaUpload/>
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

      </form>);
  }
}

Form.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Form);