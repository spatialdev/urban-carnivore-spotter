import { Map } from 'immutable';

const speciesColorMap = Map({'black bear': '#FF00D8','bobcat': '#fe1513','coyote': '#6D0891','cougar/mountain lion': '#2C9E0D','raccoon': '#95CAE9','opossum': '#171ab1','river otter': '#1F1F20'});

export const getColorForSpecies = (species) => {
    const color = speciesColorMap.get(species.toLowerCase());
    return color ? color : '#805b14';
};
export {speciesColorMap};

const speciesDisplayName = Map({'blackbear':'Black Bear','bobcat': 'Bobcat','coyote': 'Coyote','cougar': 'Cougar/Mountain Lion','raccoon': 'Raccoon','opossum': 'Opossum','riverotter': 'River Otter'});

export const getDisplayName = (species) => {
    return speciesDisplayName.get(species);
};
