import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';


const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 250,
  },
});

const species = ['Black Bear', 'Bobcat', 'Cougar/Mountain Lion', 'Coyote', 'Opossum', 'Raccoon', 'River Otter'];

class Form extends Component {
  state = {
    species: '',
    timestamp: '',
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { classes } = this.props;
    return (
      <form className="formWizardBody" autoComplete="off">
        <div>
          <h4>Which animal did you see?</h4>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="species">Species</InputLabel>
            <Select
              value={this.state.species}
              onChange={this.handleChange}
              inputProps={{
                name: 'species',
                id: 'species',
              }}
            >
              {species.map((type, idx) => <MenuItem key={idx} value={type}>{type}</MenuItem>)}
            </Select>
          </FormControl>
        </div>
        <div>

        </div>
      <div>
        <h4>When did you see the animal?</h4>
        <TextField
          value={this.state.timestamp}
          id="datetime-local"
          label="Observation date and time"
          type="datetime-local"
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            name: 'timestamp',
            id: 'timestamp',
          }}
          onChange={this.handleChange}
        />
      </div>

      </form>);
  }
}

Form.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Form);