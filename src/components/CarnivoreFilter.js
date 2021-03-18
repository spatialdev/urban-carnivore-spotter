import React from "react";
import { withStyles } from "@material-ui/core/styles";
import FilterCheckboxes from "./FilterCheckboxes";
import { connect } from "react-redux";
import { updateFilter } from "../store/actions";
import { getColorForSpecies } from "../services/ColorService";
import Collapsible from './Collapsible';

const styles = {};

class CarnivoreFilter extends React.Component {
  constructor ( props ) {
    super( props );
    this.state = {
      showCarnivores: false,
    };
  }

  updateFilterSubsection = ( subsectionName ) => ( key, newValue ) => {
    updateFilter( subsectionName, key, newValue );
  };

  toggleShow = ( groupName ) => () => {
    this.setState( ( state ) => ( { ...state, [groupName]: !state[groupName] } ) );
  };

  render = () => {
    const {
      classes,
      filter: { carnivoreFilter },
    } = this.props;
    const { showCarnivores } = this.state;

    return (
      <Collapsible
        headerTitle="Type of Carnivore"
        onClick={ this.toggleShow( "showCarnivores" ) }
        expand={ showCarnivores }
      >
        <FilterCheckboxes
          filter={ carnivoreFilter }
          allLabel="All Carnivores"
          updateValues={ this.updateFilterSubsection( "carnivoreFilter" ) }
          briefNumber={ Object.keys( carnivoreFilter ).length - 1 }
          keyColorFunction={ getColorForSpecies }
        />
      </Collapsible>
    );
  };
}

const mapStateToProps = ( state ) => {
  return {
    filter: {
      carnivoreFilter: state.filter.carnivoreFilter,
    },
  };
};
export default connect( mapStateToProps )( withStyles( styles )( CarnivoreFilter ) );
