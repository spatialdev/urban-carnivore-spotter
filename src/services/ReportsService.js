import axios from "axios";

const REPORTS_ENDPOINT =
  "https://us-central1-seattlecarnivores-edca2.cloudfunctions.net/getReports";
// const PAGINATED_REPORTS_ENDPOINT =
//   "https://us-central1-seattlecarnivores-edca2.cloudfunctions.net/getPaginatedReports";
// const UPDATE_REPORTS_ENDPOINT =
//   "https://us-central1-seattlecarnivores-edca2.cloudfunctions.net/updateReports";

export const getReports = () => {
  return axios
    .get(REPORTS_ENDPOINT)
    .then((reports) => reports.data)
    .catch((error) => error);
};

// export const getPaginatedReports = (pageNum) => {
//   return axios
//     .get(`${PAGINATED_REPORTS_ENDPOINT}/?pageNum=${pageNum}`)
//     .then((reports) => console.log("PAGINATED REPS", reports))
//     .catch((error) => error);
// };

// export const updateReports = (id, updatedNeighborhood) => {
//   const updated = JSON.stringify(updatedNeighborhood);
//   return axios
//     .get(`${UPDATE_REPORTS_ENDPOINT}/?id=${id}&updatedNeighborhood=${updated}`)
//     .then((res) => console.log("REPORTS UPDATED", JSON.stringify(res)))
//     .catch((error) => error);
// };
