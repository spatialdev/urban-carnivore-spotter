import { SET_MOBILE, UPDATE_FILTER, UPDATE_FILTER_DATE, TOGGLE_FILTER_CONFIDENCE, RESET_FILTER } from './constants';
import { getInitialFilter } from '../services/FilterService';

const initialState = {
    filter: getInitialFilter(),
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