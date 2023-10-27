const functions = require( "firebase-functions" );
const cors = require( "cors" )( { origin: true } );
const admin = require( "firebase-admin" );
const moment = require( "moment" );
const turf = require( "@turf/turf" );
const nodemailer = require( "nodemailer" );

admin.initializeApp( functions.config().firebase );
const database = admin.firestore();

const NEIGHBORHOOD = "neighborhood";
const UNIQUES = "uniques";
const REPORTS = "reports";
const REPORTS_TACOMA = "reportsTacoma";
const REPORT_URL_STUB =
  "https://console.firebase.google.com/project/seattlecarnivores-edca2/database/firestore/data~2Freports~2F";
const TACOMA_REPORTS_URL =
  "https://console.firebase.google.com/project/seattlecarnivores-edca2/database/firestore/data~2FreportsTacoma~2F";

// initialize username/password
const username = functions.config().email.username;
const password = functions.config().email.password;

/**
 * Internal helper method that converts JS Date objects to firebase timestamps.
 * Thanks to https://stackoverflow.com/questions/53482750/convert-date-to-timestamp-for-storing-into-firebase-firestore-in-javascript
 * for the hint
 */
const toTimestamp = ( date ) => {
  return admin.firestore.Timestamp.fromDate( date );
};

exports.addReport = functions.https.onRequest( ( req, res ) => {
  return cors( req, res, () => {
    if ( req.method !== "POST" ) {
      return res.status( 401 ).json( {
        message: "Not allowed",
      } );
    }
    const reportWithTimestamp = Object.assign( req.body, {
      time_submitted: toTimestamp( new Date() ),
    } );
    // Add neighborhood to the list of unique neighborhoods, if it's not already present
    const updateNeighborhoodsPromise = database
      .collection( UNIQUES )
      .doc( NEIGHBORHOOD )
      .update( {
        values: admin.firestore.FieldValue.arrayUnion(
          reportWithTimestamp[NEIGHBORHOOD]
        ),
      } );
    // Add the full report to the database.
    let BUCKET =
      req.body.isTacoma !== undefined && req.body.isTacoma === true
        ? REPORTS_TACOMA
        : REPORTS;
    const addReportPromise = database
      .collection( BUCKET )
      .add( reportWithTimestamp );
    return Promise.all( [updateNeighborhoodsPromise, addReportPromise] )
      .then( ( ref ) => {
        return res.status( 200 ).send( "Success!" );
      } )
      .catch( ( error ) => {
        return res.status( 500 ).send( `Error adding document: ${ error }` );
      } );
  } );
} );
/**
 * Reports contain a lot of extraneous (and personally identifying!) information that we should not be sending to all
 * clients. This pulls out the important fields for a single report viewing, which are:
 *  - timestamp
 *  - species
 *  - neighborhood
 *  - confidence
 *  - mediaPaths
 *
 * Returns an object containing just the relevant fields from the document.
 */
filterReport = ( document ) => {
  const allData = document.data();
  return {
    mediaPaths: allData.mediaPaths,
    species: allData.species,
    timestamp: allData.timestamp,
    neighborhood: allData.neighborhood,
    confidence: allData.confidence,
    numberOfAdultSpecies: allData.numberOfAdultSpecies,
    numberOfYoungSpecies: allData.numberOfYoungSpecies,
    mapLng: allData.mapLng,
    mapLat: allData.mapLat,
  };
};

exports.getReport = functions.https.onRequest( ( req, res ) => {
  return cors( req, res, () => {
    if ( req.method !== "GET" ) {
      return res.status( 404 ).json( {
        message: "Not found",
      } );
    }
    return database
      .collection( REPORTS )
      .doc( req.query.id )
      .get()
      .then( ( doc ) => {
        if ( doc.exists ) {
          return res.status( 200 ).send( filterReport( doc ) );
        } else {
          return res.status( 200 ).send( {} );
        }
      } )
      .catch( ( error ) => {
        return res.status( 500 ).send( `Error getting documents: ${ error }` );
      } );
  } );
} );

exports.getTacomaReport = functions.https.onRequest( ( req, res ) => {
  return cors( req, res, () => {
    if ( req.method !== "GET" ) {
      return res.status( 404 ).json( {
        message: "Not found",
      } );
    }
    return database
      .collection( REPORTS_TACOMA )
      .doc( req.query.id )
      .get()
      .then( ( doc ) => {
        if ( doc.exists ) {
          return res.status( 200 ).send( filterReport( doc ) );
        } else {
          return res.status( 200 ).send( {} );
        }
      } )
      .catch( ( error ) => {
        return res.status( 500 ).send( `Error getting documents: ${ error }` );
      } );
  } );
} );

/**
 * Internal helper method to build database queries given some parameters.
 * Currently accepts species, neighborhood, season, year, and time_of_day as fields
 * that are acceptable to search. Always filters by at least one week old.
 */
buildQuery = ( queryParams, collection ) => {
  // always filter by time_submitted
  let week_ago = toTimestamp( moment().subtract( 10, "days" ).toDate() );
  let initialQuery = collection.where( "time_submitted", "<=", week_ago );
  if ( queryParams.species ) {
    initialQuery = initialQuery.where( "species", "==", queryParams.species );
  }
  if ( queryParams.neighborhood ) {
    initialQuery = initialQuery.where(
      NEIGHBORHOOD,
      "==",
      queryParams.neighborhood
    );
  }
  if ( queryParams.season ) {
    initialQuery = initialQuery.where( "season", "==", queryParams.season );
  }
  if ( queryParams.year ) {
    initialQuery = initialQuery.where( "year", "==", queryParams.year );
  }
  if ( queryParams.timeOfDay ) {
    initialQuery = initialQuery.where(
      "time_of_day",
      "==",
      queryParams.timeOfDay
    );
  }
  return initialQuery;
};

/**
 * Reports contain a lot of extraneous (and personally identifying!) information that we should not be sending to all
 * clients. This pulls out the important fields, which are:
 *  - timestamp
 *  - species
 *  - neighborhood
 *  - confidence
 *  - time_submitted
 *  - id
 *  - mediaPaths
 *  - mapLng
 *  - mapLat
 *
 * Returns an object containing just the relevant fields from the document.
 */
filterReports = ( document ) => {
  const allData = document.data();
  return {
    timestamp: allData.timestamp,
    species: allData.species,
    neighborhood: allData.neighborhood,
    confidence: allData.confidence,
    time_submitted: allData.time_submitted,
    id: allData.id,
    mediaPaths: allData.mediaPaths,
    mapLng: allData.mapLng,
    mapLat: allData.mapLat,
  };
};

exports.getReports = functions.https.onRequest( ( req, res ) => {
  return cors(
    req,
    res,
    () => {
      if ( req.method !== "GET" ) {
        return res.status( 404 ).json( {
          message: `Not Allowed`,
        } );
      }
      let reports = database.collection( REPORTS );
      let reports_tacoma = database.collection( REPORTS_TACOMA );
      let querySnapshotPromise = buildQuery( req.query, reports ).get();
      let querySnapshotPromiseTacoma = buildQuery(
        req.query,
        reports_tacoma
      ).get();
      return Promise.all( [querySnapshotPromiseTacoma, querySnapshotPromise] )
        .then( ( values ) => {
          let items = [];
          values.forEach( ( snapshot ) => {
            if ( !snapshot.empty ) {
              if (
                req.query.mapLat !== undefined &&
                req.query.mapLng !== undefined
              ) {
                const queryLatitude = Number( req.query.mapLat );
                const queryLongitude = Number( req.query.mapLng );
                const from = turf.point( [queryLongitude, queryLatitude] );
                const options = { units: "miles" };
                snapshot.forEach( ( doc ) => {
                  const data = doc.data();
                  let dataLatitude = data["mapLat"];
                  let dataLongitude = data["mapLng"];
                  if (
                    dataLatitude !== undefined &&
                    dataLongitude !== undefined
                  ) {
                    const to = turf.point( [dataLongitude, dataLatitude] );
                    const distance = turf.distance( from, to, options );
                    // If distance is within 500 miles from the query lat long
                    if ( distance <= 500 ) {
                      items.push( { id: doc.id, data: filterReports( doc ) } );
                    }
                  }
                } );
              } else {
                snapshot.forEach( ( doc ) => {
                  items.push( { id: doc.id, data: filterReports( doc ) } );
                } );
              }
            }
          } );
          return items.length === 0
            ? res.status( 200 ).send( "No data!" )
            : res.status( 200 ).send( items );
        } )
        .catch( ( err ) => {
          res.status( 500 ).send( `Error getting documents: ${ err }` );
        } );
    },
    ( error ) => {
      res.status( error.code ).json( {
        message: `Something went wrong. ${ error.message }`,
      } );
    }
  );
} );

exports.getNeighborhoods = functions.https.onRequest( ( req, res ) => {
  return cors(
    req,
    res,
    () => {
      if ( req.method !== "GET" ) {
        return res.status( 401 ).json( {
          message: "Not Allowed",
        } );
      }
      return database
        .collection( UNIQUES )
        .doc( NEIGHBORHOOD )
        .get()
        .then( ( snapshot ) => snapshot.get( "values" ) )
        .then( ( neighborhoods ) => res.status( 200 ).send( neighborhoods ) )
        .catch( ( err ) => {
          res.status( 500 ).send( `Error getting documents: ${ err }` );
        } );
    },
    ( error ) => {
      res.status( error.code ).json( {
        message: `Error getting documents: ${ error.message }`,
      } );
    }
  );
} );

// Email helpers
const sendEmail = ( from, to, subject, html ) => {
  const transporter = nodemailer.createTransport( {
    service: "gmail",
    auth: {
      user: username,
      pass: password,
    },
  } );

  const mailOptions = { from, to, subject, html };

  return transporter.sendMail( mailOptions );
};

const formatMediaPathAsTableRow = ( mediaPath, index, total ) => {
  // Each mediaPath looks like
  // https://base-url.com/v0/b/app-url/o/images%2Fmedia-id-here.jpeg?some-query-params
  const firstSplit = mediaPath.split( "%2F" );
  const id = firstSplit[1].split( "." )[0];
  const segments = firstSplit[0].split( "/" );
  const location = segments[segments.length - 1];
  const thumbnail = mediaPath.includes( "images" )
    ? `<img src=${ mediaPath } alt="image thumbnail" style="width: 100px;"/>`
    : "No thumbnail for non-image media.";
  // Don't style the bottom row, since we have a border around everything.
  const trStyle =
    index === total - 1 ? "" : ' style="border-bottom: 1px solid black"';
  return `<tr${ trStyle }>
        <td>${ mediaPath }</td>
        <td>${ thumbnail }</td>
        <td>${ location }/</td>
        <td>${ id }</td>
    </tr>`;
};

const formatSubmissionAsTableRow = ( reportSnapshot ) => {
  const id = reportSnapshot.id;
  const data = reportSnapshot.data();
  const species = data.species;
  const mediaPaths = data.mediaPaths;
  const neighborhood = data.neighborhood;
  const vocalizationDescription = data.vocalizationDesc
    ? data.vocalizationDesc
    : "N/A";
  const reactionDescription = data.reactionDescription
    ? data.reactionDescription
    : "N/A";
  const name = data.contactName ? data.contactName : "N/A";
  const email = data.contactEmail ? data.contactEmail : "N/A";
  const phone = data.contactPhone ? data.contactPhone : "N/A";
  const comments = data.generalComments ? data.generalComments : "N/A";
  const URL =
    data.isTacoma && data.isTacoma === true
      ? TACOMA_REPORTS_URL
      : REPORT_URL_STUB;

  return `<tr>
        <td>${ id }</td>
        <td>${ species }</td>
        <td>
            <table>
                <tr>
                  <th>Media Paths</th>
                  <th>Media Thumbnails</th>
                  <th>Media Bucket</th>
                  <th>Media IDs</th>
                </tr>
                ${ mediaPaths
      .map( ( path, index ) =>
        formatMediaPathAsTableRow( path, index, mediaPaths.length )
      )
      .join( "" ) }
            </table>
        </td>
        <td>${ neighborhood }</td>
        <td><strong>Vocalization:</strong> ${ vocalizationDescription }<br/>
            <strong>Reaction:</strong> ${ reactionDescription }<br/>
            <strong>General comments:</strong> ${ comments }
        </td>
        <strong>Name:</strong> ${ name }<br/>
            <strong>Email:</strong> ${ email }<br/>
            <strong>Phone:</strong> ${ phone }
        </td>
        <td>${ URL }${ id }</td>
     </tr>`;
};

const formatSubmissionAsTable = ( reportSnapshots ) => {
  return `<table style="border: 1px solid black">
     <tr>
       <th>ID</th>
       <th>Species</th>
       <th>Media</th>
       <th>Neighborhood</th>
       <th>Optional Text Comments</th>
       <th>Contact Information</th>
       <th>Link to Report</th>
     </tr>
     ${ reportSnapshots
      .map( ( snapshot ) => formatSubmissionAsTableRow( snapshot ) )
      .join( "" ) }
   </table>`;
};

const sendNewSubmissionEmail = ( reportSnapshot ) => {
  const from = `"Test reporters" <${ username }@gmail.com>`;
  const to = `"Seattle Carnivore Spotter" <seattlecarnivores@zoo.org>`;
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
  const html = `<head>${ styles }</head>A new report was submitted with the following characteristics:<br/>
        ${ formatSubmissionAsTable( [reportSnapshot] ) }`;
  return sendEmail( from, to, subject, html );
};

const sendWeeklyDigestEmail = ( reportSnapshots ) => {
  const from = `"Test reporters" <${ username }@gmail.com>`;
  const to = `"Seattle Carnivore Spotter" <seattlecarnivores@zoo.org>`;
  const subject = "Weekly Carnivore Spotting Submission Digest";
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
        table tr + tr{
            border-bottom: 1px solid black;
        }
    </style>`;
  const html = `<head>${ styles }</head>Over the past week, the following reports were submitted:<br/>
      ${ formatSubmissionAsTable( reportSnapshots ) }`;
  return sendEmail( from, to, subject, html );
};

/**
 * Whenever a new document is added to the reports collection, send a notification email.
 */
exports.sendEmailOnReportCreation = functions.firestore
  .document( `${ REPORTS }/{reportId}` )
  .onCreate( ( snapshot, context ) => {
    sendNewSubmissionEmail( snapshot );
  } );

/**
 * Whenever a new document is added to the Tacoma reports collection, send a notification email.
 */
exports.sendEmailOnReportTacomaCreation = functions.firestore
  .document( `${ REPORTS_TACOMA }/{reportId}` )
  .onCreate( ( snapshot, context ) => {
    sendNewSubmissionEmail( snapshot );
  } );

/**
 * Every week, send a digest containing all of the submissions from the last week.
 */
exports.weeklyDigest = functions.pubsub
  .schedule( "0 10 * * 2" )
  .onRun( ( context ) => {
    const weekAgo = toTimestamp( moment().subtract( 1, "week" ).toDate() );
    return database
      .collection( REPORTS )
      .where( "time_submitted", ">=", weekAgo )
      .get()
      .then( ( snapshot ) => {
        return sendWeeklyDigestEmail( snapshot.docs );
      } );
  } );

/**
 * Every week, send a digest containing all of the submissions from the Tacoma collection from last week.
 */
exports.weeklyDigestTacoma = functions.pubsub
  .schedule( "0 10 * * 2" )
  .onRun( ( context ) => {
    const weekAgo = toTimestamp( moment().subtract( 1, "week" ).toDate() );
    return database
      .collection( REPORTS_TACOMA )
      .where( "time_submitted", ">=", weekAgo )
      .get()
      .then( ( snapshot ) => {
        return sendWeeklyDigestEmail( snapshot.docs );
      } );
  } );

// pulls all data
exports.dataDump = functions.https.onRequest((req, res) => {
  return cors(
    req,
    res,
    () => {
      if (req.method !== "GET") {
        return res.status(404).json({
          message: `Not Allowed`,
        });
      }
      let reports = database.collection(REPORTS);
      let reports_tacoma = database.collection(REPORTS_TACOMA);
      let querySnapshotPromise = buildQuery(req.query, reports).get();
      let querySnapshotPromiseTacoma = buildQuery(
        req.query,
        reports_tacoma
      ).get();
      return Promise.all([querySnapshotPromiseTacoma, querySnapshotPromise])
        .then((values) => {
          let items = [];
          values.forEach((snapshot) => {
            if (!snapshot.empty) {
              snapshot.forEach((doc) => {
                const all = doc.data();
                items.push({
                  id: doc.id,
                  data: filterReports(doc),
                  ...all,
                });
              });
            }
          });
          return items.length === 0
            ? res.status(200).send("No data!")
            : res.status(200).send(items);
        })
        .catch((err) => {
          res.status(500).send(`Error getting data dump: ${err}`);
        });
    },
    (error) => {
      res.status(error.code).json({
        message: `Something went wrong. ${error.message}`,
      });
    }
  );
});
