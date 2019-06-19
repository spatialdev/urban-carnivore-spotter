import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { Tabs, Tab } from '@material-ui/core';
import SpeciesCardDesktop from "./SpeciesCardDesktop";
import { getAllSpecies, getDataForSpecies, getSpeciesByIndex, getImageBySpecies, getDisplayName } from '../services/SpeciesService';

const styles = {
  allContent: {
    maxWidth: 1000,
    width: '100%',
    backgroundColor: '#ececec',
    padding: 32,
  },
  widthWrapper: {
    display: 'flex',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 37px)'
  },
  speciesContent: {
    marginTop: 72,

  },
  header: {
    textAlign: 'left',
  },
  content: {
    textAlign: 'left'
  },
  tabsContainer: {
    margin: '0px -32px 0px -32px',
    backgroundColor: 'white',
  },
  tab: {
    minWidth: 140,
  }
};

class ResourcesDesktop extends Component {

  state = {
    tabValue: 0
  };

  render() {
    const {classes} = this.props;
    const {tabValue} = this.state;
    const currData = getDataForSpecies(getSpeciesByIndex(tabValue));
    return <div className={classes.widthWrapper}>
      <div className={classes.allContent}>
        <div className={classes.speciesContent}>
          <h3 className={classes.header}>Species Identification Tips</h3>
          <div className={classes.tabsContainer}>
            <Tabs
              value={tabValue}
              onChange={(e, tabValue) => this.setState({tabValue})}
            >
              {getAllSpecies().map((species, ind) => <Tab className={classes.tab} label={getDisplayName(species)} key={ind}/>)}
            </Tabs>
          </div>
          {<SpeciesCardDesktop speciesName={currData.name}
                                   latinName={currData.latin}
                                   weight={currData.weight}
                                   height={currData.height}
                                   diet={currData.diet}
                                   identTips={currData.ident}
                                   largerThanLab={currData.larger}
                                   imagePath={getImageBySpecies(currData.shortname)}
          />}
        </div>
        <div>
          <h3 className={classes.header}>Seattle Urban Carnivore Project</h3>
          <div className={classes.content}>
            <p>Seattle Spotter is part of the Seattle Urban Carnivore Project, a collaboration between the Seattle University and Woodland Park Zoo.</p>
            <a href="https://www.zoo.org/otters">learn more</a>
          </div>
        </div>
        <div>
          <h3 className={classes.header}>Contact Us</h3>
          <div className={classes.content} >
            <a href="mailto:seattlecarnivores@zoo.org">seattlecarnivores@zoo.org</a>
          </div>
        </div>
      </div>
    </div>
  }
};

export default withStyles(styles)(ResourcesDesktop);