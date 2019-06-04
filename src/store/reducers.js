import { SET_MOBILE, UPDATE_FILTER, UPDATE_FILTER_DATE, TOGGLE_FILTER_CONFIDENCE, RESET_FILTER, UPDATE_ALL_NEIGHBORHOODS } from './constants';
import { getInitialFilter } from '../services/FilterService';

const initialState = {
    filter: getInitialFilter([]),
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
            return {...state, filter: getInitialFilter(state.allNeighborhoods)}
        case UPDATE_FILTER_DATE:
            return {...state, filter: {...state.filter,
                date: action.newDate}
            }
        case TOGGLE_FILTER_CONFIDENCE:
            return {...state, filter: {...state.filter,
                confidenceFilterActive: !state.filter.confidenceFilterActive}
            }
        // When we update the list of all neighborhoods, the filter should contain
        // all neighborhoods: false, plus an all: true.
        case UPDATE_ALL_NEIGHBORHOODS:
            const newFilter = action.value.reduce((obj, neighborhood) => {
                obj[neighborhood] = false;
                return obj;
            }, {all: true});
            return {...state,
                filter: {...state.filter,
                    neighborhoodFilter: newFilter
                }}
    }
    return state;
}

export {reducer, initialState};