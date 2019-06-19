import blackBear from '../assets/text/Black_Bear';
import bobcat from '../assets/text/Bobcat';
import cougar from '../assets/text/Cougar';
import coyote from '../assets/text/Coyote';
import opossum from '../assets/text/Opossum';
import raccoon from '../assets/text/Racoon';
import riverOtter from '../assets/text/River_Otter';

import bearPng from '../assets/tips-images/black_bear.png';
import bobcatPng from '../assets/tips-images/bobcat.png';
import cougarPng from '../assets/tips-images/cougar.png';
import coyotePng from '../assets/tips-images/coyote.png';
import opossumPng from '../assets/tips-images/opossum.png';
import raccoonPng from '../assets/tips-images/racoon.png';
import otterPng from '../assets/tips-images/river_otter.png';

const dataMap = new Map([['blackbear', blackBear], ['bobcat', bobcat], ['cougar', cougar],
  ['coyote', coyote], ['opossum', opossum], ['raccoon', raccoon], ['riverotter', riverOtter]]);
const imgMap = new Map([['blackbear', bearPng], ['bobcat', bobcatPng], ['cougar', cougarPng],
  ['coyote', coyotePng], ['opossum', opossumPng], ['raccoon', raccoonPng], ['riverotter', otterPng]]);
const speciesList = ['blackbear', 'bobcat', 'cougar', 'coyote', 'opossum', 'raccoon', 'riverotter'];

export const getAllSpecies = () => {
  return speciesList;
};

export const getDataForSpecies = (speciesName) => {
  return dataMap.get(speciesName);
};

export const getSpeciesByIndex = (index) => {
  return speciesList[index];
};

export const getImageBySpecies = (speciesName) => {
  return imgMap.get(speciesName);
};

export const getDisplayName = (shortName) => {
  return dataMap.get(shortName).name;
};