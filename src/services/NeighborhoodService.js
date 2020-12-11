import * as mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";
import axios from "axios";

const ALL_NEIGHBORHOODS_ENDPOINT =
  "https://us-central1-seattlecarnivores-edca2.cloudfunctions.net/getNeighborhoods";

export default class NeighborhoodService {
  constructor() {
    this.geocodingService = mbxGeocoding({
      accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
    });
  }

  getNeighborhoodFor = (lat, lng) => {
    // Create request
    return this.geocodingService
      .reverseGeocode({
        query: [lng, lat],
        types: ["neighborhood", "place", "region"],
      })
      .send()
      .then((response) => {
        const neighborhoods = response.body.features;
        if (neighborhoods && neighborhoods.length > 0) {
          return neighborhoods[0].text;
        }
      });
  };

  isInTacoma = (lat, lng) => {
    // Create request
    return this.geocodingService
      .reverseGeocode({
        query: [lng, lat],
        types: ["place"],
      })
      .send()
      .then((response) => {
        const places = response.body.features;
        return places && places.length > 0 ? places[0].text : {};
      });
  };

  static getAllNeighborhoods = () => {
    return axios
      .get(ALL_NEIGHBORHOODS_ENDPOINT)
      .then((neighborhoods) => neighborhoods.data.sort());
  };
}
