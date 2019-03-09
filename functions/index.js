const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');
const moment = require('moment');
admin.initializeApp(functions.config().firebase);
// const database = admin.database().ref('/reports');
const database = admin.firestore();

// exports.addReport = functions.https.onRequest((req, res) => {
//   return cors(req, res, () => {
//     if (req.method !== 'POST') {
//       return res.status(401).json({
//         message: 'Not allowed'
//       });
//     }

//     const report = req.body;

//     database.push(report);
//     let reports = [];

//     return database.on('value', snapshot => {
//       snapshot.forEach(report => {
//         reports.push(report);
//       });
//       res.status(200).json(reports);
//     }, (error) => {
//       res.status(error.code).json({
//         message: `Something went wrong. ${error.message}`
//       });
//     });
//   });
// });

exports.getReports = functions.https.onRequest((req, res) => {
  console.log('got request')
  return cors(req, res, () => {
    console.log('inside cors');
    if (req.method !== 'GET') {
      return res.status(404).json({
        message: `Not Allowed`
      });
    }
    console.log('allowed method');
    let reports = database.collection('reports');
    let week_ago = moment().subtract(1, 'week').toDate();
    console.log(`A week ago: ${week_ago}`);
    return reports
      // confidence of at least 70
      .where('species_confidence', '==', 'high')
      // submitted at least a week ago
      .where('time_submitted', '<=', week_ago)
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