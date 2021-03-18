import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import FilterCheckboxes from "./FilterCheckboxes";
import { connect } from "react-redux";
import { updateFilter } from "../store/actions";
import Collapsible from './Collapsible';

const styles = {
  search: {
    display: "flex",
    margin: "0.5em",
    justifyContent: "center",
  },
  searchInput: {
    margin: 0,
    padding: 0,
  },
  inputContent: {
    fontSize: "1em",
  },
};

const briefNeighborhoodsCount = 5;
class NeighborhoodFilter extends React.Component {
  constructor ( props ) {
    super( props );
    this.state = {
      showNeighborhoods: false,
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
      filter: { neighborhoodFilter },
      searchedNeighborhood,
      handleNeighborhoodSearch,
      setNeighborhoodSearch,
    } = this.props;
    const { showNeighborhoods } = this.state;

    return (
      <Collapsible
        headerTitle="Neighborhood"
        onClick={ this.toggleShow( "showNeighborhoods" ) }
        expand={ showNeighborhoods }
      >
        <div className={ classes.search }>
          <TextField
            size="small"
            className={ classes.searchInput }
            InputProps={ {
              classes: {
                input: classes.inputContent,
              },
            } }
            InputLabelProps={ {
              classes: {
                root: classes.inputContent,
              },
            } }
            label="Neighborhood"
            margin="normal"
            variant="outlined"
            value={ searchedNeighborhood }
            onChange={ ( e ) => {
              setNeighborhoodSearch( e.target.value );
              handleNeighborhoodSearch( e.target.value );
            } }
          />
        </div>
        <FilterCheckboxes
          filter={ neighborhoodFilter }
          allLabel="All Neighborhoods"
          updateValues={ this.updateFilterSubsection( "neighborhoodFilter" ) }
          briefNumber={ briefNeighborhoodsCount }
        />
      </Collapsible>
    );
  };
}

const mapStateToProps = ( state ) => {
  return {
    filter: {
      neighborhoodFilter: state.filter.neighborhoodFilter,
    },
  };
};
export default connect( mapStateToProps )( withStyles( styles )( NeighborhoodFilter ) );
