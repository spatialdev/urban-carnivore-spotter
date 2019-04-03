const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');
const moment = require('moment');
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
    initialQuery = initalQuery.where('time_of_day', '==', queryParams.timeOfDay);
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
          let items = [];
          snapshot.forEach(doc => {
            items.push({ id: doc.id, data: doc.data() });
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
