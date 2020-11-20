import axios from "axios";

const REPORTS_ENDPOINT =
  "https://us-central1-seattlecarnivores-edca2.cloudfunctions.net/getReports";

export const getReports = () => {
  return axios
    .get(REPORTS_ENDPOINT)
    .then((reports) => reports.data)
    .catch((error) => error);
};
