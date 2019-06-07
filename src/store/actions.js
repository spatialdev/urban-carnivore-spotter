import { SET_MOBILE, UPDATE_FILTER, UPDATE_FILTER_DATE, TOGGLE_FILTER_CONFIDENCE, RESET_FILTER, UPDATE_ALL_NEIGHBORHOODS } from './constants';
import {store} from './index';

export const setMobile = (value) => {
    store.dispatch({
        type: SET_MOBILE,
        value
    });
}

export const updateFilter = (filterName, key, newValue) => {
    store.dispatch({
        type: UPDATE_FILTER,
        filterName,
        key,
        newValue
    });
}

export const resetFilter = () => {
    store.dispatch({
        type: RESET_FILTER
    });
}

export const updateFilterDate = (newDate) => {
    store.dispatch({
        type: UPDATE_FILTER_DATE,
        newDate
    });
}

export const toggleFilterConfidence = () => {
    store.dispatch({
        type: TOGGLE_FILTER_CONFIDENCE
    });
}

export const updateAllNeighborhoods = (allNeighborhoods) => {
    store.dispatch({
        type: UPDATE_ALL_NEIGHBORHOODS,
        value: allNeighborhoods
    })
}
