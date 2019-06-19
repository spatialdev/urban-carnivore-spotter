import React from 'react';
import Card from '@material-ui/core/Card';
import Placeholder from '../assets/placeholder.svg';
import Labrador from '../assets/Labrador.svg';

import {withStyles} from '@material-ui/core';

const styles = {
  image: {
    height: 100,
    maxHeight: '40%',
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
    backgroundColor: '#F5F5F5'
  },
  labImage: {
    margin: 16,
    width: '46px !important',
  }
};

const SpeciesCard = (props) => {
  const {classes, speciesName, latinName, weight, height, diet, identTips, largerThanLab} = props;
  return <Card className={classes.allContent}>
    <img className={classes.image}
         src={Placeholder}
         alt={speciesName}/>
    <div className={classes.headerContainer}>
      <h3 className={classes.speciesHeader}>{speciesName}</h3>
      <h4 className={classes.speciesHeader}>({latinName})</h4>
    </div>
    <p className={classes.characteristic}><strong>Weight:</strong> {weight}</p>
    <p className={classes.characteristic}><strong>Height at shoulder:</strong> {height}</p>
    <p className={classes.characteristic}><strong>Diet:</strong> {diet}</p>
    <p className={classes.characteristic}><strong>Identification tips:</strong> {identTips}</p>
    <div className={classes.labrador}>
      <div>
        <p className={classes.characteristic}><strong>{largerThanLab ? 'Larger' : 'Smaller'} than a Labrador!</strong></p>
        <p className={classes.characteristic}><strong>Lab weight:</strong> 55-80 lbs / 25-26 kg</p>
        <p className={classes.characteristic}><strong>Lab height:</strong> 21-25 in / 53-62 cm</p>
      </div>
      <img className={classes.labImage} src={Labrador} alt={'Labrador'}/>
    </div>
  </Card>
};

export default withStyles(styles)(SpeciesCard);