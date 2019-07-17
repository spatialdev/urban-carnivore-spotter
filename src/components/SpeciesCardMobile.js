import React from 'react';
import Card from '@material-ui/core/Card';
import Placeholder from '../assets/placeholder.svg';
import SpeciesCardInfo from './SpeciesCardInfo';

import {withStyles} from '@material-ui/core';

const styles = {
  image: {
    width: '100%',
    objectFit: 'contain',
  },
  characteristic: {
    textAlign: 'left',
    marginLeft: 24,
  },
  labrador: {
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: 'grey',
    margin: 11,
    '& p': {
      marginLeft: 11
    },
    display: 'flex',
    justifyContent: 'space-between',
  },
  speciesHeader: {
    margin: '4px 0px 0px 24px',
    textAlign: 'left',
  },
  headerContainer: {
    margin: '32px 0px 32px 0px'
  },
  allContent: {
    backgroundColor: '#F5F5F5',
    height: '100%'
  },
  labImage: {
    margin: 16,
    width: '46px !important',
  }
};

const SpeciesCardMobile = (props) => {
  const {classes, speciesName, latinName, weight, height, diet, identTips, largerThanLab, imagePath} = props;
  return <Card className={classes.allContent}>
    <img className={classes.image}
         src={imagePath}
         alt={speciesName}/>
    <div className={classes.headerContainer}>
      <h3 className={classes.speciesHeader}>{speciesName}</h3>
      <h4 className={classes.speciesHeader}>(<em>{latinName}</em>)</h4>
    </div>
    <SpeciesCardInfo
      weight={weight}
      height={height}
      diet={diet}
      identTips={identTips}
      largerThanLab={largerThanLab}
    />
  </Card>
};

export default withStyles(styles)(SpeciesCardMobile);