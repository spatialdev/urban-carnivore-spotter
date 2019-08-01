const functions = require('firebase-functions');
const cors = require('cors')({ origin: 'http://localhost' });
const admin = require('firebase-admin');
const moment = require('moment');
const turf = require('@turf/turf');
const nodemailer = require('nodemailer');

admin.initializeApp(functions.config().firebase);
const database = admin.firestore();

const NEIGHBORHOOD = 'neighborhood';
const UNIQUES = 'uniques';
const REPORTS = 'reports';
const REPORT_URL_STUB = 'https://console.firebase.google.com/u/1/project/seattlecarnivores-edca2/database/firestore/data~2Freports~2F';

// initialize username/password
const username = functions.config().email.username;
const password = functions.config().email.password;
/**
 * Internal helper method that converts JS Date objects to firebase timestamps.
 * Thanks to https://stackoverflow.com/questions/53482750/convert-date-to-timestamp-for-storing-into-firebase-firestore-in-javascript
 * for the hint
 */
const toTimestamp = (date) => {
  return admin.firestore.Timestamp.fromDate(date);
};

exports.addReport = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== 'POST') {
      return res.status(401).json({
        message: 'Not allowed'
      });
    }
    const reportWithTimestamp = Object.assign(req.body, {time_submitted: toTimestamp(new Date())});
    // Add neighborhood to the list of unique neighborhoods, if it's not already present
    const updateNeighborhoodsPromise = database.collection(UNIQUES).doc(NEIGHBORHOOD)
      .update({
        values: admin.firestore.FieldValue.arrayUnion(reportWithTimestamp[NEIGHBORHOOD])
      });
    // Add the full report to the database.
    const addReportPromise = database.collection(REPORTS).add(reportWithTimestamp);
    return Promise.all([updateNeighborhoodsPromise, addReportPromise])
      .then(ref => {
        return res.status(200).send('Success!');
      })
      .catch(error => {
        return res.status(500).send(`Error adding document: ${error}`);
    });
  });
});

exports.getReport = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== 'GET') {
      return res.status(401).json({
        message: 'Not allowed'
      });
    }
    return database.collection(REPORTS).doc(req.query.id)
      .get()
      .then(doc => {
        if (doc.exists) {
          return res.status(200).send(doc.data());
        } else {
          return res.status(200).send('No data!');
        }
      })
      .catch(error => {
        return res.status(500).send(`Error getting documents: ${error}`);
      })
  });
});


/**
 * Internal helper method to build database queries given some parameters.
 * Currently accepts species, neighborhood, season, year, and time_of_day as fields
 * that are acceptable to search. Always filters by at least one week old.
 */
buildQuery = (queryParams, collection) => {
  // always filter by time_submitted
  // let week_ago = toTimestamp(moment().subtract(10, 'days').toDate());
  // let initialQuery = collection.where('time_submitted', '<=', week_ago);
  let initialQuery = collection;
  if (queryParams.species) {
    initialQuery = initialQuery.where('species', '==', queryParams.species);
  }
  if (queryParams.neighborhood) {
    initialQuery = initialQuery.where(NEIGHBORHOOD, '==', queryParams.neighborhood);
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
    let reports = database.collection(REPORTS);
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
            let dataLatitude = data['mapLat'];
            let dataLongitude = data['mapLng'];
            if (dataLatitude !== undefined && dataLongitude !== undefined) {
              const to = turf.point([dataLongitude,dataLatitude]);
              const distance = turf.distance(from, to, options);
              // If distance is within 500 miles from the query lat long
              if (distance <= 500) {
                items.push({ id: doc.id, data: doc.data() });
              }
            }
          });
        } else {
          snapshot.forEach(doc => {
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

exports.getNeighborhoods = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== 'GET') {
      return res.status(401).json({
        message: 'Not Allowed'
      });
    }
    return database.collection(UNIQUES)
      .doc(NEIGHBORHOOD)
      .get()
      .then(snapshot => snapshot.get('values'))
      .then(neighborhoods => res.status(200).send(neighborhoods))
      .catch(err => {
        res.status(500).send(`Error getting documents: ${err}`);
      });
  },
  (error) => {
      res.status(error.code).json({
      message: `Error getting documents: ${error.message}`
    });
  });
});

// Email helpers
const sendEmail = (from, to, subject, html) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: username,
            pass: password
        }
    });

    const mailOptions = { from, to, subject, html };

    return transporter.sendMail(mailOptions);
};

const formatMediaPathAsTableRow = (mediaPath, index, total) => {
  // Each mediaPath looks like
  // https://base-url.com/v0/b/app-url/o/images%2Fmedia-id-here.jpeg?some-query-params
  const firstSplit = mediaPath.split("%2F");
  const id = firstSplit[1].split(".")[0];
  const segments = firstSplit[0].split("/");
  const location = segments[segments.length - 1];
  const thumbnail = mediaPath.includes("images") ? `<img src=${mediaPath} alt="image thumbnail" style="width: 100px;"/>`
                                                 : "No thumbnail for non-image media.";
  // Don't style the bottom row, since we have a border around everything.
  const trStyle = index === total - 1 ? '' : ' style="border-bottom: 1px solid black"';
  return `<tr${trStyle}>
        <td>${mediaPath}</td>
        <td>${thumbnail}</td>
        <td>${location}: ${id}</td>
    </tr>`;
};

const formatSubmissionAsTable = (reportSnapshot) => {
  const id = reportSnapshot.id;
  const data = reportSnapshot.data();
  const mediaPaths = data.mediaPaths;
  const neighborhood = data.neighborhood;
  const vocalizationDescription = data.vocalizationDesc ? data.vocalizationDesc : 'N/A';
  const reactionDescription = data.reactionDescription ? data.reactionDescription : 'N/A';
  const name = data.contactName ? data.contactName : 'N/A';
  const email = data.contactEmail ? data.contactEmail : 'N/A';
  const phone = data.contactPhone ? data.contactPhone : 'N/A';
  const comments = data.generalComments ? data.generalComments : 'N/A';

  return `<table style="border: 1px solid black">
     <tr>
       <th>ID</th>
       <th>Media</th>
       <th>Neighborhood</th>
       <th>Optional Text Comments</th>
       <th>Contact Information</th>
       <th>Link to Report</th>
     </tr>
     <tr>
        <td>${id}</td>
        <td>
            <table>
                <tr>
                  <th>Media Paths</th>
                  <th>Media Thumbnails</th>
                  <th>Media IDs</th>
                </tr>
                ${mediaPaths.map((path, index) => formatMediaPathAsTableRow(path, index, mediaPaths.length)).join("")}
            </table>
        </td>
        <td>${neighborhood}</td>
        <td><strong>Vocalization:</strong> ${vocalizationDescription}<br/>
            <strong>Reaction:</strong> ${reactionDescription}<br/>
            <strong>General comments:</strong> ${comments}
        </td>
        <strong>Name:</strong> ${name}<br/>
            <strong>Email:</strong> ${email}<br/>
            <strong>Phone:</strong> ${phone}
        </td>
        <td>${REPORT_URL_STUB}${id}</td>
     </tr>
   </table>`;
};

const sendNewSubmissionEmail = (reportSnapshot) => {
    const from = `"Test reporters" <${username}@example.com>`;
    const to = `"Seattle Carnivore Spotter" <mjnacht@gmail.com>`;
    const subject = "New report submitted";
    const styles = `<style>
        table td + td { 
            border-left: 1px solid black;
        }
        table {
            border-collapse: collapse;
        }
        th {
            border-bottom: 1px solid black;
        }
    </style>`;
    const html = `<head>${styles}</head>A new report was submitted with the following characteristics:<br/>
        ${formatSubmissionAsTable(reportSnapshot)}`;
    return sendEmail(from, to, subject, html);
};

/**
 * Whenever a new document is added to the reports collection, send a notification email.
 */
exports.reportAdded = functions.firestore.document(`${REPORTS}/{reportId}`)
    .onCreate((snapshot, context) => {
      console.log('report added');
      sendNewSubmissionEmail(snapshot);
    });
