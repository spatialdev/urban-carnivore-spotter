const functions = require( "firebase-functions-test" );
const admin = require( "firebase-admin" );
const path = require( "path" );

const projectConfig = {
  projectId: "seattlecarnivores-edca2",
  databaseURL: "https://seattlecarnivores-edca2.firebaseio.com/"
};

const testEnv = functions( projectConfig, path.resolve( "service-key.json" ) );
testEnv.mockConfig( { email: { username: 'Mealear', password: "12345678" } } );

describe( "my functions", () => {
  let adminStub, api;

  beforeAll( () => {
    adminStub = jest.spyOn( admin, "initializeApp" );

    // after initializeApp call, we load our functions
    api = require( "../index.js" );
  } );

  afterAll( () => {
    // clean things up
    adminStub.mockRestore();
    testEnv.cleanup();
  } );

  const testReport = {
    timestamp: new Date(),
    species: "Black Bear TEST",
    neighborhood: "Bellevue",
    confidence: "100% confidence",
    time_submitted: new Date(),
    id: 'test-report',
    mediaPaths: [],
    mapLng: -122.200676,
    mapLat: 47.610378,
    isTacoma: false,
  };

  const testTacomaReport = {
    timestamp: new Date(),
    species: "Black Bear TEST",
    neighborhood: "Tacoma",
    confidence: "100% confidence",
    time_submitted: new Date(),
    id: 'test-tacoma',
    mediaPaths: [],
    mapLng: -122.4443,
    mapLat: 47.2529,
    isTacoma: true,
  };


  it( "should get all reports", async () => {
    let request = { headers: { origin: true }, method: "GET", query: testReport };
    const response = {
      setHeader: ( key, value ) => {
      },
      getHeader: ( value ) => {
      },
      status: ( code ) => {
        expect( code ).toBe( 200 );
      }
    };
    api.getReports( request, response );
  } );

  it( "should add new report", async () => {
    let request = { headers: { origin: true }, method: "POST", body: testReport };
    const response = {
      setHeader: ( key, value ) => {
      },
      getHeader: ( value ) => {
      },
      status: ( code ) => {
        expect( code ).toBe( 200 );
      }
    };
    api.addReport( request, response );
  } );

  it( "should get report", async () => {
    let request = { headers: { origin: true }, method: "GET", query: testReport };
    const response = {
      setHeader: ( key, value ) => {
      },
      getHeader: ( value ) => {
      },
      status: ( code ) => {
        expect( code ).toBe( 200 );
      }
    };
    api.getReport( request, response );
  } );

  it( "should add new Tacoma report", async () => {
    let request = { headers: { origin: true }, method: "POST", body: testTacomaReport };
    const response = {
      setHeader: ( key, value ) => {
      },
      getHeader: ( value ) => {
      },
      status: ( code ) => {
        expect( code ).toBe( 200 );
      }
    };
    api.addReport( request, response );
  } );


  it( "should get Tacoma report", async () => {
    let request = { headers: { origin: true }, method: "GET", query: testTacomaReport };
    const response = {
      setHeader: ( key, value ) => {
      },
      getHeader: ( value ) => {
      },
      status: ( code ) => {
        expect( code ).toBe( 200 );
      }
    };
    api.getTacomaReport( request, response );
  } );

  it( "should get neighborhoods", async () => {
    let request = { headers: { origin: true }, method: "GET", query: {} };
    const response = {
      setHeader: ( key, value ) => {
      },
      getHeader: ( value ) => {
      },
      status: ( code ) => {
        expect( code ).toBe( 200 );
      }
    };
    api.getNeighborhoods( request, response );
  } );
} );