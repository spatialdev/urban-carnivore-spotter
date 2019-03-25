const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');
const moment = require('moment');
admin.initializeApp(functions.config().firebase);
const database = admin.firestore();
const GeoPoint = admin.firestore.GeoPoint;

exports.addReport = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== 'POST') {
      return res.status(401).json({
        message: 'Not allowed'
      });
    }

    const report = req.body;

    database.collection('reports').add(report)
    .then(ref => {
      return res.status(200).send('Success!');  
    })
    .catch(error => {
      return res.status(500).send(`Error adding document: ${error}`);
    });
  });
});

/**
 * Internal helper method to build database queries given some parameters.
 * Currently accepts species, neighborhood, season, year, and time_of_day as fields
 * that are acceptable to search. Always filters by at least one week old.
 */
buildQuery = (queryParams, collection) => {
  let week_ago = moment().subtract(0, 'week').toDate();
  let initialQuery = collection
      //.where('time_submitted', '<=', week_ago);
  if (queryParams.species) {
    initialQuery = initialQuery.where('species', '==', queryParams.species);
  }
  if (queryParams.neighborhood) {
    initialQuery = initialQuery.where('neighborhood', '==', queryParams.neighborhood);
  }
  if (queryParams.season) {
    initialQuery = initialQuery.where('season', '==', queryParams.season);
  }
  if (queryParams.year) {
    initialQuery = initialQuery.where('year', '==', queryParams.year);
  }
  if (queryParams.timeOfDay) {
    initialQuery = initalQuery.where('time_of_day', '==', queryParams.timeOfDay);
  }
  if(queryParams.location) {
    // Distance in km (1mile equivalent)
    let distance = 1.60934;
    // split into latitude and longitude
    let [latitudeStr,longitudeStr] = queryParams.location.split(",");
    let latitude = +latitudeStr;
    let longitude = +longitudeStr;

    // earth's radius in km = ~6371
    let radius = 6371;

    // latitude boundaries
    let latBound = (distance/radius)*(180/Math.PI);
    let maxLatitude = latitude + latBound;
    let minLatitude = latitude - latBound;

    // longitude boundaries (longitude gets smaller when latitude increases)
    let longBound = (distance/radius/Math.cos(latitude*(Math.PI/180)));
    let maxLongitude = longitude + longBound;
    let minLongitude = longitude - longBound;

    let lesserGeoPoint = new GeoPoint(minLatitude,minLongitude);
    let greaterGeoPoint = new GeoPoint(maxLatitude,maxLongitude);
    initialQuery = initialQuery.where('location','>=',lesserGeoPoint).
    where('location','<=',greaterGeoPoint);
  }
  return initialQuery;
};

exports.getReports = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== 'GET') {
      return res.status(404).json({
        message: `Not Allowed`
      });
    }
    let reports = database.collection('reports');
    return buildQuery(req.query, reports)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          res.status(200).send('No data!');
        } else {
          let items = []
          snapshot.forEach(doc => {
            items.push({id: doc.id, data: doc.data()});
          });
          res.status(200).send(items);
        }
      })
      .catch(err => {
        res.status(500).send(`Error getting documents: ${err}`);
      });
  }, (error) => {
    res.status(error.code).json({
      message: `Something went wrong. ${error.message}`
    });
  });
});
