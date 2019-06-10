import { Map } from 'immutable';

const speciesColorMap = Map({'black bear':'#801e78','bobcat': '#498029','coyote': '#561480','cougar/mountain lion': '#802a00','raccoon': '#093c80','opossum': '#FFDC26','river otter': '#7083ff'});

export const getColorForSpecies = (species) => {
    const color = speciesColorMap.get(species.toLowerCase());
    return color ? color : '#805b14';
};

const speciesDisplayName = Map({'blackbear':'Black Bear','bobcat': 'Bobcat','coyote': 'Coyote','cougar': 'Cougar/Mountain Lion','raccoon': 'Raccoon','opossum': 'Opossum','riverotter': 'River Otter'});

export const getDisplayName = (species) => {
    return speciesDisplayName.get(species);
};