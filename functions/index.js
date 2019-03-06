const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');
admin.initializeApp();
const database = admin.database().ref('/reports');

exports.addReport = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== 'POST') {
      return res.status(401).json({
        message: 'Not allowed'
      });
    }

    const report = req.body;

    database.push(report);
    let reports = [];

    return database.on('value', snapshot => {
      snapshot.forEach(report => {
        reports.push(report);
      });
      res.status(200).json(reports);
    }, (error) => {
      res.status(error.code).json({
        message: `Something went wrong. ${error.message}`
      });
    });
  });
});