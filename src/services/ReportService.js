import axios from "axios";

const REPORT_ENDPOINT =
  "https://us-central1-seattlecarnivores-edca2.cloudfunctions.net/getReport";

const TACOMA_REPORT_ENDPOINT =
  "https://us-central1-seattlecarnivores-edca2.cloudfunctions.net/getTacomaReport";

export const getReport = (id) => {
  return axios
    .get(`${REPORT_ENDPOINT}/?id=${id}`)
    .then((report) => report)
    .catch((error) => error);
};

export const getTacomaReport = (id) => {
  return axios
    .get(`${TACOMA_REPORT_ENDPOINT}/?id=${id}`)
    .then((tacomaReport) => tacomaReport)
    .catch((error) => error);
};
