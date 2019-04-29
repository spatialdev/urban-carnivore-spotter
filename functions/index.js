const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');
const moment = require('moment');
const turf = require('@turf/turf');
admin.initializeApp(functions.config().firebase);
const database = admin.firestore();

exports.addReport = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== 'POST') {
      return res.status(401).json({
        message: 'Not allowed'
      });
    }

    const report = req.body;

    const result = database.collection('reports').add(report)
      .then(ref => {
        return res.status(200).send('Success!');
      })
      .catch(error => {
        return res.status(500).send(`Error adding document: ${error}`);
      });
    return result;
  });
});

/**
 * Internal helper method to build database queries given some parameters.
 * Currently accepts species, neighborhood, season, year, and time_of_day as fields
 * that are acceptable to search. Always filters by at least one week old.
 */
buildQuery = (queryParams, collection) => {
  // always filter by time_submitted
  let week_ago = moment().subtract(1, 'week').toDate();
  let initialQuery = collection
    .where('time_submitted', '<=', week_ago);
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
    initialQuery = initialQuery.where('time_of_day', '==', queryParams.timeOfDay);
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
        let items = [];
        if (snapshot.empty) {
          res.status(200).send('No data!');
        } else if (req.query.mapLat !== undefined && req.query.mapLng !== undefined) {
          const queryLatitude = Number(req.query.mapLat);
          const queryLongitude = Number(req.query.mapLng);
          const from = turf.point([queryLongitude, queryLatitude]);
          const options = { units: 'miles' };
          snapshot.forEach(doc => {
            const data = doc.data();
            const dataLatitude = data['mapLat'];
            const dataLongitude = data['mapLng'];
            if (dataLatitude !== undefined && dataLongitude !== undefined) {
              const to = turf.point([dataLongitude, dataLatitude]);
              const distance = turf.distance(from, to, options);
              console.log(distance)
              // If distance is within 1 mile from the query lat long
              if (distance <= 1000) {
                items.push({ id: doc.id, data: doc.data() });
              }
            }
          });
        } else {
          snapshot.forEach(doc => {
            console.log(doc)
            items.push({ id: doc.id, data: doc.data() });
          });
        }
        return items.length === 0 ? res.status(200).send('No data!') : res.status(200).send(items);
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
