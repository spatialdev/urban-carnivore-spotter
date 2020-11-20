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
import { store } from "./index";

export const setMobile = (value) => {
  store.dispatch({
    type: SET_MOBILE,
    value,
  });
};

export const setReports = (value) => {
  store.dispatch({
    type: SET_REPORTS,
    value,
  });
};

export const setReport = (value) => {
  store.dispatch({
    type: SET_REPORT,
    value,
  });
};

export const updateFilter = (filterName, key, newValue) => {
  store.dispatch({
    type: UPDATE_FILTER,
    filterName,
    key,
    newValue,
  });
};

export const resetFilter = () => {
  store.dispatch({
    type: RESET_FILTER,
  });
};

export const updateFilterDate = (startDate, endDate) => {
  store.dispatch({
    type: UPDATE_FILTER_DATE,
    startDate,
    endDate,
  });
};

export const toggleFilterConfidence = () => {
  store.dispatch({
    type: TOGGLE_FILTER_CONFIDENCE,
  });
};

export const updateAllNeighborhoods = (allNeighborhoods) => {
  store.dispatch({
    type: UPDATE_ALL_NEIGHBORHOODS,
    value: allNeighborhoods,
  });
};

export const updateMobileResourceExpands = (newExpands) => {
  store.dispatch({
    type: UPDATE_MOBILE_RESOURCE_EXPANDS,
    expands: newExpands,
  });
};
