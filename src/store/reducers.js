import {
  SET_MOBILE,
  SET_REPORTS,
  SET_REPORT,
  UPDATE_FILTER,
  UPDATE_FILTER_DATE,
  TOGGLE_FILTER_CONFIDENCE,
  RESET_FILTER,
  UPDATE_ALL_NEIGHBORHOODS,
  UPDATE_MOBILE_RESOURCE_EXPANDS,
} from "./constants";
import { getInitialFilter } from "../services/FilterService";

const initialState = {
  filter: getInitialFilter([]),
  isMobile: false,
  mobileResourceExpands: {
    showTips: false,
    showProjectDescription: false,
    showContactUs: false,
  },
};

/**
 * Given a filter and a new key/value pair, update the filter appropriately. Automatically handles the logic for the
 * 'all' checkbox.
 * @param oldFilter - a subset of the filter for a previous state. For example, the carnivore filter
 * @param key - the key at which we want to change a value
 * @param value - the new value we want to set
 * @returns {{}} - a new filter with an appropriate value for 'all' and the new key/value pair.
 */
const updateFilterReducer = (oldFilter, key, value, order) => {
  // The all key has some special behavior
  if (key === "all") {
    // turning all on should also turn on all other values inside of this filter
    // similarly, turning all off should also turn off all other values inside of this filter
    if (!order) {
      return Object.keys(oldFilter).reduce(
        (object, newKey) => ({
          ...object,
          [newKey]: { ...oldFilter[newKey], value },
        }),
        {}
      );
    } else {
      return Object.keys(oldFilter).reduce(
        (object, newKey) => ({
          ...object,
          [newKey]: { order, value },
        }),
        {}
      );
    }
  } else {
    let newFilter;
    // update the value
    if (!order) {
      newFilter = { ...oldFilter, [key]: { ...oldFilter[key], value } };
    } else {
      newFilter = { ...oldFilter, [key]: { order, value } };
    }
    // If all are now true, set 'all' to true. Otherwise set 'all' to false
    newFilter.all = {
      order: 0,
      value: Object.entries(newFilter)
        .filter(([key, val]) => key !== "all")
        .every(([key, val]) => val.value === true),
    };
    return newFilter;
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case SET_MOBILE:
      return { ...state, isMobile: action.value };
    case SET_REPORTS:
      return { ...state, reports: action.value };
    case SET_REPORT:
      return { ...state, report: action.value };
    case UPDATE_FILTER:
      return {
        ...state,
        filter: {
          ...state.filter,
          [action.filterName]: updateFilterReducer(
            state.filter[action.filterName],
            action.key,
            action.newValue,
            action.order
          ),
        },
      };
    case RESET_FILTER:
      const allNeighborhoods = Object.keys(state.filter.neighborhoodFilter);
      return { ...state, filter: getInitialFilter(allNeighborhoods) };
    case UPDATE_FILTER_DATE:
      return {
        ...state,
        filter: {
          ...state.filter,
          startDate: action.startDate,
          endDate: action.endDate,
        },
      };
    case TOGGLE_FILTER_CONFIDENCE:
      return {
        ...state,
        filter: {
          ...state.filter,
          confidenceFilterActive: !state.filter.confidenceFilterActive,
        },
      };
    // When we update the list of all neighborhoods, the filter should contain
    // all neighborhoods: false, plus an all: true.
    case UPDATE_ALL_NEIGHBORHOODS:
      const newFilter = action.value.reduce(
        (obj, neighborhood, index) => {
          obj[neighborhood] = { order: index, value: true };
          return obj;
        },
        { all: { order: 0, value: true } }
      );
      return {
        ...state,
        filter: { ...state.filter, neighborhoodFilter: newFilter },
      };
    case UPDATE_MOBILE_RESOURCE_EXPANDS:
      return { ...state, mobileResourceExpands: action.expands };
  }
  return state;
};

export { reducer, initialState };
