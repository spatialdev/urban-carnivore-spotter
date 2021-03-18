import React from "react";
import { withStyles } from "@material-ui/core/styles";
import FilterCheckboxes from "./FilterCheckboxes";
import { connect } from "react-redux";
import { updateFilter } from "../store/actions";
import Collapsible from './Collapsible';

const styles = {};

class MediaFilter extends React.Component {
  constructor ( props ) {
    super( props );
    this.state = {
      showMedia: false,
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
      filter: { mediaFilter },
    } = this.props;
    const { showMedia } = this.state;

    return (
      <Collapsible
        headerTitle="Media"
        onClick={ this.toggleShow( "showMedia" ) }
        expand={ showMedia }
      >
        <FilterCheckboxes
          filter={ mediaFilter }
          allLabel="All Media"
          updateValues={ this.updateFilterSubsection( "mediaFilter" ) }
          briefNumber={ Object.keys( mediaFilter ).length - 1 }
        />
      </Collapsible>
    );
  };
}

const mapStateToProps = ( state ) => {
  return {
    filter: {
      mediaFilter: state.filter.mediaFilter,
    },
  };
};
export default connect( mapStateToProps )( withStyles( styles )( MediaFilter ) );
