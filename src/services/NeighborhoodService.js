import * as mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

export default class NeighborhoodService {
    constructor() {
        this.geocodingService = mbxGeocoding({ accessToken: process.env.REACT_APP_MAPBOX_TOKEN});
        console.log(process.env.REACT_APP_MAPBOX_TOKEN);
    }

    getNeighborhoodFor = (lat, lng) => {
        // Create request
        return this.geocodingService.reverseGeocode({
            query: [lng, lat],
            types: ['neighborhood']
        })
            .send()
            .then(response => {
                const neighborhoods = response.body.features;
                console.log(neighborhoods);
                if (neighborhoods) {
                    console.log(neighborhoods[0].text);
                    return neighborhoods[0].text;
                }
                return "Unknown";
            });
    }
}