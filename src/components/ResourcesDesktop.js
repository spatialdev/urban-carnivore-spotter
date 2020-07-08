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
    paddingBottom: 24
  },
  header: {
    textAlign: 'left',
  },
  content: {
    textAlign: 'left',
    paddingBottom: 24
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
              variant="scrollable"
              scrollButtons="auto"
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
        <hr/>
        <div>
          <h3 className={classes.header}> {window.location.pathname.indexOf('tacoma')===-1 ? 'Seattle Urban Carnivore Project and Grit City Carnivore Project': 'Grit City Carnivore Project and Seattle Urban Carnivore Project'}</h3>
          <div className={classes.content}>
            <p>Carnivore Spotter was developed by Woodland Park Zoo and Seattle University and is a component of both the
              <a href="https://www.zoo.org/seattlecarnivores"> Seattle Urban Carnivore Project</a>
                and the <a href="https://gritcitycarnivores.org/">Grit City Carnivore Project</a>. Together we're studying carnivores throughout the Puget Sound region as part of the Urban Wildlife Information Network. </p>
              {window.location.pathname.indexOf('tacoma')===-1 ? <a href="https://www.zoo.org/carnivorespotter">Seattle Urban Carnivore Project - learn more</a> : <a href="https://gritcitycarnivores.org/">Grit City Carnivore Project - learn more and contact us</a> }
          </div>
        </div>
        <hr/>
          { window.location.pathname.indexOf('tacoma')===-1?<div>
          <h3 className={classes.header}>Contact Us</h3>
          <div className={classes.content} >
            <a href="mailto:seattlecarnivores@zoo.org">seattlecarnivores@zoo.org</a>
          </div>
        </div> : <div/>}

      </div>
    </div>
  }
};

export default withStyles(styles)(ResourcesDesktop);
