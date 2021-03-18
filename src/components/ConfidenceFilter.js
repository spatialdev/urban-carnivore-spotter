import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Typography,
} from "@material-ui/core";
import CheckBoxIntermediateIcon from "mdi-react/CheckboxIntermediateIcon";
import { connect } from "react-redux";
import { updateFilter, toggleFilterConfidence } from "../store/actions";
import Collapsible from './Collapsible';

const styles = {
  formControlLabel: {
    fontSize: "0.85em",
    fontFamily: "Raleway",
    color: "#767676",
    fontWeight: 500,
  },
};

class ConfidenceFilter extends React.Component {
  constructor ( props ) {
    super( props );
    this.state = {
      showConfidence: false,
    };
  }

  updateFilterSubsection = ( subsectionName ) => ( key, newValue ) => {
    updateFilter( subsectionName, key, newValue );
  };

  toggleShow = ( groupName ) => () => {
    this.setState( ( state ) => ( { ...state, [groupName]: !state[groupName] } ) );
  };

  toggleConfidence = () => {
    toggleFilterConfidence();
  };

  render = () => {
    const {
      classes,
      filter: { confidenceFilterActive },
    } = this.props;
    const { showConfidence } = this.state;

    return (
      <Collapsible
        headerTitle="Confidence of Sighting"
        onClick={ this.toggleShow( "showConfidence" ) }
        expand={ showConfidence }
      >
        <FormControl component="fieldset">
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={ confidenceFilterActive }
                  onChange={ this.toggleConfidence }
                  checkedIcon={
                    <CheckBoxIntermediateIcon style={ { color: "#93C838" } } />
                  }
                  style={ { margin: "0px 0px 0px 8px" } }
                />
              }
              label={
                <Typography className={ classes.formControlLabel }>
                  "Only show high-confidence sightings"
                  </Typography>
              }
            />
          </FormGroup>
        </FormControl>
      </Collapsible>
    );
  };
}

const mapStateToProps = ( state ) => {
  return {
    filter: {
      confidenceFilterActive: state.filter.confidenceFilterActive,
    },
  };
};
export default connect( mapStateToProps )( withStyles( styles )( ConfidenceFilter ) );
