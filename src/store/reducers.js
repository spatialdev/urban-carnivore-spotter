import { SET_MOBILE, UPDATE_FILTER, UPDATE_FILTER_DATE, TOGGLE_FILTER_CONFIDENCE, RESET_FILTER } from './constants';
import { getInitialFilter } from '../services/FilterService';

/**
 * Set up initial state and the store.
 */
const allCarnivores = ['Black Bear', 'Bobcat', 'Coyote', 'Cougar/Mountain Lion', 'Racoon', 'Other'];
const allNeighborhoods = ['Ballard', 'Beacon Hill', 'Bothell', 'Broadview', 'Burien', 'Capitol Hill', 'Chinatown', 'Downtown'] // and more...
const allTimes = ['Early Morning (12:00am-4:59am)', 'Morning (5:00am-11:59am)', 'Afternoon (12:00pm-5:59pm)', 'Evening (6:00pm-11:59pm)'];

// Carnivore, neighborhood, and times defaults
const defaultCarnivoreFilter = {all: true};
allCarnivores.forEach(carnivore => defaultCarnivoreFilter[carnivore] = false);
const defaultNeighborhoodFilter = {all: true};
allNeighborhoods.forEach(neighborhood => defaultNeighborhoodFilter[neighborhood] = false);
const defaultTimeFilter = {all: true};
allTimes.forEach(time => defaultTimeFilter[time] = false);

const initialState = {
    filter: {
        carnivoreFilter: {...defaultCarnivoreFilter},
        neighborhoodFilter: {...defaultNeighborhoodFilter},
        date: null,
        timeFilter: {...defaultTimeFilter},
        confidenceFilterActive: false,
    },
    isMobile: false,
}

const reducer = (state, action) => {
    switch(action.type) {
        case SET_MOBILE:
            return {...state, isMobile: action.value}
        case UPDATE_FILTER:
            return {...state, filter: {...state.filter,
                [action.filterName]: {
                    ...state.filter[action.filterName],
                    [action.key]: action.newValue
                }}
            }
        case RESET_FILTER:
            return {...state, filter: initialState.filter}
        case UPDATE_FILTER_DATE:
            return {...state, filter: {...state.filter,
                date: action.newDate}
            }
        case TOGGLE_FILTER_CONFIDENCE:
            return {...state, filter: {...state.filter,
                confidenceFilterActive: !state.filter.confidenceFilterActive}
            }
    }
    return state;
}

export {reducer, initialState};