import { Map } from 'immutable';

const speciesColorMap = Map({ 'red fox': '#FE1513', 'black bear': '#000000', 'bobcat': '#a30cfe', 'coyote': '#FECE17', 'cougar/mountain lion': '#2C9E0D', 'raccoon': '#FF1EC1', 'opossum': '#FE7901', 'river otter': '#171AB1', 'other': '#805b14' });

export const getColorForSpecies = (species) => {
    const color = speciesColorMap.get(species.toLowerCase());
    return color ? color : '#805b14';
};
export { speciesColorMap };

const speciesDisplayName = Map({ 'blackbear': 'Black Bear', 'bobcat': 'Bobcat', 'coyote': 'Coyote', 'cougar': 'Cougar/Mountain Lion', 'raccoon': 'Raccoon', 'opossum': 'Opossum', 'riverotter': 'River Otter', 'fox': 'Red Fox', 'other': 'Other' });

export const getDisplayName = (species) => {
    return speciesDisplayName.get(species);
};
