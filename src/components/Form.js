import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import * as ReactGA from "react-ga";
import * as turf from "@turf/turf";

import Button from "@material-ui/core/Button";
import DialogContent from "@material-ui/core/DialogContent";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import Dialog from "@material-ui/core/Dialog";

import DatePicker from "react-datepicker";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import "react-datepicker/dist/react-datepicker.css";
import LoadingOverlay from "react-loading-overlay";
import ScrollLock from "react-scrolllock";

import MediaUpload from "./MediaUpload";
import FormMap from "./FormMap";
import StaticFormMap from "./StaticFormMap";
import MediaDisplay from "./MediaDisplay";
import FormRadioButtons from "./FormRadioButtons";
import NeighborhoodService from "../services/NeighborhoodService";
import { Collapse, Fab, withStyles } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { connect } from "react-redux";
import {
  getAllSpecies,
  getDataForSpecies,
  getImageBySpecies,
} from "../services/SpeciesService";
import FormInfoDialog from "./FormInfoDialog";
import SpeciesCard from "./SpeciesCardMobile";
import FormSelect from "./FormSelect";
const addReportUrl =
  "https://us-central1-seattlecarnivores-edca2.cloudfunctions.net/addReport";
// Options
const speciesLst = [
  "Black Bear",
  "Bobcat",
  "Cougar/Mountain Lion",
  "Coyote",
  "Opossum",
  "Raccoon",
  "River Otter",
  "Red Fox",
  "Other/Unknown",
];
const confidenceLevels = [
  "Not at all confident",
  "About 25% confident",
  "About 50% confident",
  "About 75% confident",
  "More than 75% confident",
  "100% confident",
];
const reactions = [
  "Stayed quiet",
  "Shouted/made noise",
  "I walked away",
  "Other",
];
const dogSizes = [
  "Small (up to 20lbs)",
  "Medium(20-60lbs)",
  "Large(60+lbs)",
  "Mixed group",
];
const vantagePoints = [
  "From Indoors",
  "Outdoors",
  "Vehicle",
  "Bicycle",
  "Other Vehicle",
  "Camera Footage",
];
const leashOptions = ["Leashed", "Unleashed", "Both"];
const animalBehaviors = [
  "Was eating",
  "Urinated",
  "Defecated",
  "Sleeping",
  "Moving",
  "Foraging",
  "Climbing",
  "Running",
  "Other",
];
const vocalizations = ["Barking", "Howling", "Growling", "Other"];
const carnivoreResponses = [
  "Animal did not seem to notice observer",
  "Animal ran away",
  "Animal stood ground-seemed interested in observer",
  "Animal ignored or was uninterested in observer",
  "Animal moved towards observer, pets or livestock, and not simply to access an escape route",
  "The animal walked or moved away",
];
const conflictOptions = [
  "There was no interaction",
  "Animal made physical contact with pet or livestock",
  "Animal made physical contact with human(s)",
  "Interacted with human-related item or place (e.g., trash can, bird feeder, fence/yard, attic)",
  "I walked away",
];
const counts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// constants
const THANKS_FOR_SUBMITTING =
  "Thank you for your submission! Please note that the system will display your observation on the map after a period of ten days.";
const ERROR_ON_SUBMISSION =
  "Something went wrong during your submission. Please try again later.";
const FILES_TOO_LARGE =
  "Please choose a set of files to upload that are smaller than 10MB in total.";
const MAX_FILE_SIZE = 10485760; // 10MiB
const neighborhoodService = new NeighborhoodService();
const DIALOG_MODES = {
  THANKS: "thanks",
  ERROR: "error",
  LARGE_FILES: "largeFiles",
  PERMISSION: "permission",
  CLOSED: "closed",
  MISSING_FIELD: "missing field",
  NOT_WA: "notWA",
};
const TACOMA_LINE_FOR_BBOX = turf.lineString([
  [-122.670442006814, 47.0600919913851],
  [-122.320456134032, 47.3206338868513],
]);
const TACOMA_BBOX = turf.bboxPolygon(turf.bbox(TACOMA_LINE_FOR_BBOX));

const styles = {
  addReportFormWrapper: {
    backgroundColor: "white",
    height: "100vh",
    width: "100vw",
  },
  reportCarnivoreTitle: {
    backgroundColor: "white",
    padding: "1em",
    margin: 0,
  },
  overlay: {
    height: "100vh",
    width: "100vw",
    position: "fixed",
    top: 0,
    zIndex: 999,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    backgroundColor: "white",
    zIndex: 1,
  },
  expandButton: {
    boxShadow: "none",
    backgroundColor: "#93C838",
    color: "white",
    margin: "1em 1em 1.5em 1em",
  },
  expandHeader: {
    margin: 16,
    justifyContent: "space-between",
  },
  headerTitle: {
    fontWeight: "bold",
    alignText: "center",
  },
  collapsible: {
    margin: 0,
    textAlign: "center",
  },
  carouselDesktop: {
    width: 400,
    height: 500,
  },
  carouselMobile: {
    minWidth: 160,
    minHeight: 200,
    maxWidth: 320,
    maxHeight: 400,
  },
  mobileImage: {
    width: 300,
    height: 389,
  },
  desktopImage: {
    width: 382,
    height: 495,
  },
  radioButtonContainerMobile: {
    display: "flex",
    alignItems: "baseline",
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
    paddingLeft: 35,
    paddingRight: 35,
  },
  addButtonContainer: {
    position: "relative",
    top: -250,
    zIndex: 0,
  },
  doneButtonContainer: {
    display: "flex",
    justifyContent: "center",
  },
  interactiveMapContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  interactiveMapInnerContainer: {
    flex: 1,
  },
  constantHeightMapContainer: {
    height: "100px",
  },
  fab: {
    backgroundColor: "#8acc25",
  },
  notWA: {
    color: "red",
  },
};

//https://github.com/Hacker0x01/react-datepicker/issues/942#issuecomment-485934975
class CustomDatePickerInput extends Component {
  render = () => (
    <input
      onClick={this.props.onClick}
      value={this.props.value}
      type="text"
      readOnly={true}
    />
  );
}

class Form extends Component {
  state = {
    species: "",
    timestamp: new Date(),
    mapLat:
      window.location.pathname.indexOf("tacoma") === -1
        ? 47.668733
        : 47.3049119,
    mapLng:
      window.location.pathname.indexOf("tacoma") === -1
        ? -122.354291
        : -122.522997,
    confidence: "",
    animalFeatures: "",
    numberOfAdultSpecies: "1",
    numberOfYoungSpecies: "0",
    numberOfAdults: "",
    numberOfChildren: "",
    reaction: "",
    reactionDescription: "",
    numberOfDogs: "",
    dogSize: "",
    onLeash: "",
    vantagePoint: "",
    animalBehavior: "",
    animalEating: "",
    vocalization: "",
    vocalizationDesc: "",
    carnivoreResponse: "",
    carnivoreConflict: "",
    conflictDesc: "",
    contactEmail: "",
    contactName: "",
    contactPhone: "",
    generalComments: "",
    neighborhood: "",
    media: null,
    imagePaths: [],
    videoPaths: [],
    audioPaths: [],
    dialogMode: DIALOG_MODES.CLOSED,
    submitting: false,
    permissionOpen: false,
    showObserverDetails: false,
    showAnimalBehavior: false,
    showContactInformation: false,
    showCarousel: false,
    carouselImageIndex: 0,
    editMode: false,
    addMode: false,
    finalMap: true,
    spinnerActive: false,
    isTacoma: false,
  };

  constructor(props) {
    super(props);
    this.fileUploader = React.createRef();
  }

  updateNeighborhood = (lat, lng) => {
    neighborhoodService.getNeighborhoodFor(lat, lng).then((neighborhood) =>
      this.setState((state) => {
        // If the map coordinates have changed, we don't want to update the neighborhood with outdated info!
        if (state.mapLat === lat && state.mapLng === lng) {
          return { neighborhood };
        }
        return {};
      })
    );
  };

  updatePlace = (lat, lng) => {
    neighborhoodService.isInTacoma(lat, lng).then((place) => {
      // If place from neighborhoodService comes back as empty, check if the point lies within the TACOMA_BBOX
      if (JSON.stringify(place) === "{}") {
        const point = turf.point([lng, lat]);
        this.setState({
          isTacoma: turf.booleanPointInPolygon(point, TACOMA_BBOX),
        });
      } else {
        this.setState({
          isTacoma: place.toString().toLowerCase() === "tacoma",
        });
      }
    });
  };

  componentDidMount = () => {
    ReactGA.pageview(window.location.pathname);
    // The neighborhood is initialized to the empty string, but we want to have a neighborhood for our
    // initial location!
    this.updateNeighborhood(this.state.mapLat, this.state.mapLng);
    this.updatePlace(this.state.mapLat, this.state.mapLng);
    // Request the user's geolocation and default to there
    // See https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API for more information
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.getMapCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => console.log(err)
      );
    }
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  validateInWA = (lng, lat) => {
    const currLocationPoint = [lng, lat];
    const WAPolygon = turf.polygon(
      [
        [
          [-116.917743, 45.995573],
          [-118.966114, 46.005403],
          [-121.163807, 45.609812],
          [-121.215295, 45.674068],
          [-121.360283, 45.70703],
          [-121.897875, 45.690659],
          [-122.330837, 45.56107],
          [-122.759213, 45.666266],
          [-122.915931, 46.092278],
          [-123.115501, 46.187866],
          [-123.165341, 46.192934],
          [-123.279738, 46.151596],
          [-123.37092, 46.147066],
          [-123.429264, 46.182269],
          [-123.425675, 46.23004],
          [-123.492101, 46.27357],
          [-123.876566, 46.240521],
          [-124.029415, 46.301199],
          [-124.035945, 46.265801],
          [-124.031756, 46.312027],
          [-124.08125, 46.269956],
          [-124.864301, 48.469223],
          [-123.136963, 48.135124],
          [-123.207582, 48.678376],
          [-122.757723, 49.001997],
          [-117.040038, 48.993724],
          [-116.917743, 45.995573],
        ],
      ],
      { name: "Washington State" }
    );
    // Returns a boolean if location is within WA boundaries
    return turf.inside(currLocationPoint, WAPolygon);
  };

  getMapCoordinates = (dataFromMap) => {
    this.setState({ mapLat: dataFromMap.lat, mapLng: dataFromMap.lng });
    this.updateNeighborhood(dataFromMap.lat, dataFromMap.lng);
    this.updatePlace(dataFromMap.lat, dataFromMap.lng);
  };

  handleSubmit = () => {
    this.submitData();
    // const { mapLat, mapLng } = this.state;
    // const isWA = this.validateInWA(mapLng, mapLat);
    // if (isWA) {
    // this.submitData();
    // } else {
    // this.setState({ dialogMode: DIALOG_MODES.NOT_WA });
    // }
  };

  submitData = () => {
    // Pull out all of the fields we don't want to submit. Everything left in report will be submitted.
    let {
      dialogMode,
      submitting,
      audioPaths,
      videoPaths,
      imagePaths,
      addMode,
      editMode,
      finalMap,
      carouselImageIndex,
      permissionOpen,
      spinnerActive,
      showCarousel,
      showAnimalBehavior,
      showContactInformation,
      showObserverDetails,
      ...report
    } = this.state;
    delete report["media"];
    report.mediaPaths = [...audioPaths, ...videoPaths, ...imagePaths];
    this.setState({ submitting: true });
    return axios
      .post(addReportUrl, report)
      .then((response) => {
        this.setState({ submitting: false });
        if (response.status === 200) {
          this.setState({ dialogMode: DIALOG_MODES.THANKS }); // Open the submission received dialog
        } else {
          this.setState({ dialogMode: DIALOG_MODES.ERROR });
        }
      })
      .catch(() => {
        this.setState({ submitting: false, dialogMode: DIALOG_MODES.ERROR });
      });
  };

  handleUploadSuccess = (mediaType) => (files) => {
    const pathsToUpdate = `${mediaType}Paths`;
    this.setState({
      [pathsToUpdate]: files,
      media: null,
      spinnerActive: false,
    });
  };

  handleTimestampChange = (timestamp) => {
    this.setState({
      timestamp: new Date(timestamp),
    });
  };

  setMedia = (dataFromChild, uploader) => {
    this.fileUploader = uploader;
    this.setState({ media: dataFromChild });
  };

  uploadMedia = () => {
    const { media } = this.state;
    if (media) {
      const totalSize = media.reduce((sum, file) => sum + file.size, 0);
      if (totalSize >= MAX_FILE_SIZE) {
        // Remove files and ask user to upload smaller files
        this.setState({ dialogMode: DIALOG_MODES.LARGE_FILES });
      } else {
        this.setState({ spinnerActive: true });
        // Upload the files
        media.forEach((file) => this.fileUploader.startUpload(file));
      }
    }
  };

  handlePermissionResponse = (agree) => {
    this.setState({ dialogMode: DIALOG_MODES.CLOSED });
    if (agree) {
      this.uploadMedia();
    }
  };

  handleClose = () => {
    const { history, handleDrawerState, fromDrawer } = this.props;
    this.setState({ dialogMode: DIALOG_MODES.CLOSED }, () => {
      history.location.pathname.includes("tacoma")
        ? history.push("/tacoma")
        : history.push("/");
      if (fromDrawer) {
        handleDrawerState(false);
      }
    });
  };

  getCollapse = (classes, headerTitle, onClick, expand, child) => {
    return (
      <>
        <div className={classes.expandHeader}>
          <span className={classes.headerTitle}>{headerTitle}</span>
          <Fab
            className={classes.expandButton}
            onClick={onClick}
            size="small"
            disableRipple={true}
          >
            {expand ? <RemoveIcon /> : <AddIcon />}
          </Fab>
        </div>
        <Collapse in={expand} className={classes.collapsible}>
          {child}
        </Collapse>
      </>
    );
  };

  toggleShow = (groupName) => () => {
    this.setState((state) => ({ ...state, [groupName]: !state[groupName] }));
  };

  openCarousel = (index) => {
    const newIndex = index === speciesLst.length - 1 ? 0 : index;
    this.setState({
      showCarousel: true,
      carouselImageIndex: newIndex,
    });
  };

  closeCarousel = () => {
    this.setState({
      showCarousel: false,
      carouselImageIndex: 0,
    });
  };

  getDialogFromMode = (mode) => {
    switch (mode) {
      case DIALOG_MODES.CLOSED:
        return <FormInfoDialog open={false} />;
      case DIALOG_MODES.ERROR:
        return (
          <FormInfoDialog
            open={true}
            onClose={this.handleClose}
            message={ERROR_ON_SUBMISSION}
          />
        );
      case DIALOG_MODES.LARGE_FILES:
        return (
          <FormInfoDialog
            open={true}
            onClose={() => this.setState({ dialogMode: DIALOG_MODES.CLOSED })}
            message={FILES_TOO_LARGE}
          />
        );
      case DIALOG_MODES.PERMISSION:
        return (
          <FormInfoDialog
            open={true}
            onClose={() => this.setState({ dialogMode: DIALOG_MODES.CLOSED })}
            message={
              "Is it ok if we store the images and audio that you've uploaded? If you say no, we will not be able to show your pictures to other users"
            }
            noButton={{
              onClick: () => this.handlePermissionResponse(false),
              message: "No, don't use my media",
            }}
            yesButton={{
              onClick: () => this.handlePermissionResponse(true),
              message: "Yes, use my media",
            }}
          />
        );
      case DIALOG_MODES.THANKS:
        return (
          <FormInfoDialog
            open={true}
            onClose={this.handleClose}
            message={THANKS_FOR_SUBMITTING}
          />
        );
      case DIALOG_MODES.MISSING_FIELD:
        return (
          <FormInfoDialog
            open={true}
            onClose={() => this.setState({ dialogMode: DIALOG_MODES.CLOSED })}
            message={
              "Your report is missing some required fields! Please fill in all required fields and re-submit."
            }
          />
        );
      // case DIALOG_MODES.NOT_WA:
      //   return (
      //     <FormInfoDialog
      //       open={true}
      //       onClose={() => this.setState({ dialogMode: DIALOG_MODES.CLOSED })}
      //       message={
      //         "Your report is not located in Washington State. We are currently only accepting submissions within WA."
      //       }
      //     />
      //   );
      default:
        return null;
    }
  };

  showInteractiveMap = (classes, neighborhood, mapLng, mapLat) => {
    return (
      <ScrollLock>
        <div className={classes.interactiveMapContainer}>
          <p>Drag the map to mark your sighting</p>
          <div className={classes.interactiveMapInnerContainer}>
            <div
              style={{
                backgroundColor: "#ff5200",
                borderRadius: "50%",
                width: "25px",
                height: "25px",
                position: "absolute",
                top: "50%",
                left: 0,
                right: 0,
                margin: "0 auto",
                zIndex: 10000,
              }}
            />
            <FormMap
              passMapCoordinates={this.getMapCoordinates}
              centerLng={mapLng}
              centerLat={mapLat}
              className="interactiveMap"
            />
          </div>
          {neighborhood ? (
            <p style={{ alignText: "center" }}>{neighborhood}</p>
          ) : null}
          <div className={classes.doneButtonContainer}>
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={() =>
                this.setState({
                  editMode: true,
                  finalMap: true,
                  addMode: false,
                })
              }
            >
              {" "}
              DONE{" "}
            </Button>
          </div>
        </div>
      </ScrollLock>
    );
  };

  renderMap = (classes, isMobile, neighborhood, mapLng, mapLat) => {
    return isMobile ? (
      <div className="formItem">
        <h4>Identify the location of your sighting</h4>
        <div className={this.state.finalMap ? "" : "hiddenDiv"}>
          <StaticFormMap
            passMapCoordinates={this.getMapCoordinates}
            centerLng={mapLng}
            centerLat={mapLat}
          />
          <div className={classes.addButtonContainer}>
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={() => this.setState({ addMode: true })}
            >
              EDIT LOCATION
            </Button>
          </div>
          {neighborhood ? (
            <p style={{ alignText: "center" }}>{neighborhood}</p>
          ) : null}
        </div>
      </div>
    ) : (
        <div className="formItem">
          <h4>Identify the location of your sighting</h4>
          <div
            className="constantHeightMapContainer"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "#ff5200",
                borderRadius: "50%",
                width: "25px",
                height: "25px",
                position: "absolute",
                left: 0,
                right: 0,
                margin: "0 auto",
                zIndex: 10000,
              }}
            />
            <FormMap
              passMapCoordinates={this.getMapCoordinates}
              centerLng={mapLng}
              centerLat={mapLat}
            />
          </div>
          {neighborhood && <p>{neighborhood}</p>}
          {/* {!this.validateInWA(mapLng, mapLat) && (
            <div className={classes.notWA}>Not located in Washington State</div>
          )} */}
        </div>
      );
  };

  render() {
    const {
      mapLat,
      mapLng,
      timestamp,
      confidence,
      numberOfAdultSpecies,
      numberOfYoungSpecies,
      numberOfAdults,
      numberOfChildren,
      reaction,
      reactionDescription,
      numberOfDogs,
      dogSize,
      onLeash,
      vantagePoint,
      animalBehavior,
      animalEating,
      vocalization,
      vocalizationDesc,
      carnivoreResponse,
      carnivoreConflict,
      conflictDesc,
      contactName,
      contactEmail,
      contactPhone,
      generalComments,
      media,
      submitting,
      neighborhood,
      showObserverDetails,
      showAnimalBehavior,
      showContactInformation,
      spinnerActive,
      addMode,
      imagePaths,
      audioPaths,
      videoPaths,
      species,
      dialogMode,
    } = this.state;
    const { classes, isMobile, history } = this.props;

    return (
      <div className={classes.addReportFormWrapper}>
        {submitting && (
          <LoadingOverlay
            active={submitting}
            spinner
            text="Submitting..."
            className={classes.overlay}
          />
        )}
        {isMobile && (
          <Fab aria-label="Add" className={classes.fab}>
            <ClearIcon
              style={{ color: "#FFFFFF" }}
              onClick={() =>
                history.location.pathname.includes("tacoma")
                  ? history.push("/tacoma")
                  : history.push("/")
              }
            />
          </Fab>
        )}
        <h2 className={classes.reportCarnivoreTitle}>
          Report a carnivore sighting
        </h2>
        <ValidatorForm
          onError={() =>
            this.setState({ dialogMode: DIALOG_MODES.MISSING_FIELD })
          }
          onSubmit={this.handleSubmit}
          className="formWizardBody"
          autoComplete="off"
        >
          {this.renderMap(classes, isMobile, neighborhood, mapLng, mapLat)}
          <div className="formItem">
            <h4>When did you see the animal?</h4>
            {/*See https://github.com/Hacker0x01/react-datepicker/issues/942#issuecomment-485934975 for more information*/}
            <DatePicker
              selected={timestamp}
              onChange={this.handleTimestampChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              timeCaption="time"
              maxDate={new Date()}
              customInput={<CustomDatePickerInput />}
            />
          </div>
          <div className="formItem">
            <Dialog
              open={addMode}
              onClose={() => this.setState({ addMode: false })}
            >
              <DialogContent className="interactiveMapContainer">
                {this.showInteractiveMap(classes, neighborhood, mapLng, mapLat)}
              </DialogContent>
            </Dialog>
          </div>

          {/*Image*/}
          <div className="formItem">
            <h4>Upload pictures, videos or sound files</h4>
            <MediaUpload
              uploadMedia={this.setMedia}
              getMediaPaths={this.handleUploadSuccess}
              setSpinner={(bool) => this.setState({ spinnerActive: bool })}
            />
            <MediaDisplay
              filesOnDeck={media}
              uploading={spinnerActive}
              numUploadedFiles={
                imagePaths.length + audioPaths.length + videoPaths.length
              }
              removeFiles={() => this.setState({ media: null })}
            />
            {media && media.length > 0 ? (
              // Setting dialogMode to DIALOG_MODES.PERMISSION opens the permission dialog, where clicking "agree" actually calls the media upload function
              <Button
                size="small"
                color="secondary"
                variant="contained"
                onClick={() =>
                  this.setState({ dialogMode: DIALOG_MODES.PERMISSION })
                }
              >
                Confirm Upload
              </Button>
            ) : null}
          </div>

          <div className="formItem">
            <h4>Which animal did you see?</h4>
            <Dialog open={this.state.showCarousel} onClose={this.closeCarousel}>
              <DialogContent>
                <Carousel
                  className={
                    isMobile ? classes.carouselMobile : classes.carouselDesktop
                  }
                  useKeyboardArrows={true}
                  selectedItem={this.state.carouselImageIndex}
                  swipeable={true}
                  showThumbs={false}
                  showIndicators={false}
                >
                  {getAllSpecies().map((type, idx) => {
                    const data = getDataForSpecies(type);
                    return (
                      <SpeciesCard
                        key={idx}
                        speciesName={data.name}
                        latinName={data.latin}
                        weight={data.weight}
                        height={data.height}
                        diet={data.diet}
                        identTips={data.ident}
                        largerThanLab={data.larger}
                        imagePath={getImageBySpecies(data.shortname)}
                      />
                    );
                  })}
                </Carousel>
              </DialogContent>
            </Dialog>
            <FormRadioButtons
              species={speciesLst}
              onChangeSelection={(species) => () => this.setState({ species })}
              onClickInfo={(index) => () => this.openCarousel(index)}
              validators={["required"]}
              errorMessages={["This field is required"]}
              value={species}
            />
          </div>

          <div className="formItem">
            <h4>
              How confident are you that you have identified the animal
              correctly?
            </h4>
            <FormSelect
              selectedValue={confidence}
              values={confidenceLevels}
              handleChange={this.handleChange}
              required={true}
              label={"Confidence"}
              id={"confidence"}
            />
          </div>

          <div className="formItem">
            <h4>How many of the species did you see?</h4>
            <div style={{ marginBottom: "15px" }}>
              <FormSelect
                selectedValue={numberOfAdultSpecies}
                values={counts.map((count) =>
                  count === 9 ? "9+" : count.toString()
                )}
                handleChange={this.handleChange}
                required={true}
                label={"Number of Adult"}
                id={"numberOfAdultSpecies"}
              />
            </div>
            <FormSelect
              selectedValue={numberOfYoungSpecies}
              values={counts.map((count) =>
                count === 9 ? "9+" : count.toString()
              )}
              handleChange={this.handleChange}
              required={true}
              label={"Number of Young"}
              id={"numberOfYoungSpecies"}
            />
          </div>
          <hr />

          {/*Observer details*/}
          <div>
            {/* Species Identification Tips */}
            {this.getCollapse(
              classes,
              "Observer Details (Optional)",
              this.toggleShow("showObserverDetails"),
              showObserverDetails,
              <div>
                <div className="formItem">
                  <h4>How many were in your group?</h4>
                  <FormSelect
                    selectedValue={numberOfAdults}
                    style={{ marginBottom: "15px" }}
                    values={counts.map((count) =>
                      count === 9 ? "9+" : count.toString()
                    )}
                    handleChange={this.handleChange}
                    required={false}
                    label={"Number of Adults"}
                    id={"numberOfAdults"}
                  />
                  <h4>Children up to 9 years old</h4>
                  <FormSelect
                    selectedValue={numberOfChildren}
                    style={{ marginTop: "5px" }}
                    values={counts.map((count) =>
                      count === 9 ? "9+" : count.toString()
                    )}
                    handleChange={this.handleChange}
                    required={false}
                    label={"Number of Children"}
                    id={"numberOfChildren"}
                  />
                </div>

                <div className="formItem">
                  <h4>How did you react?</h4>
                  <FormSelect
                    selectedValue={reaction}
                    values={reactions}
                    handleChange={this.handleChange}
                    required={false}
                    label={"Reaction"}
                    id={"reaction"}
                  />
                  {reaction === "Other" ? (
                    <TextValidator
                      label="Describe (limit 80 char)"
                      multiline
                      rows="4"
                      value={reactionDescription}
                      inputProps={{
                        name: "reactionDescription",
                        id: "reactionDescription",
                        maxLength: 80,
                      }}
                      onChange={this.handleChange}
                      margin="normal"
                      variant="outlined"
                    />
                  ) : null}
                </div>

                <div className="formItem">
                  <h4>Were there dog(s) present with you / your group?</h4>
                  <FormSelect
                    selectedValue={numberOfDogs}
                    style={{ marginBottom: "15px" }}
                    values={counts}
                    handleChange={this.handleChange}
                    required={false}
                    label={"Number of Dogs"}
                    id={"numberOfDogs"}
                  />
                  {numberOfDogs > 0 ? (
                    <div>
                      <FormSelect
                        selectedValue={dogSize}
                        style={{ marginBottom: "15px" }}
                        values={dogSizes}
                        handleChange={this.handleChange}
                        required={false}
                        label={"Size of dog(s)"}
                        id={"dogSize"}
                      />
                      <FormSelect
                        selectedValue={onLeash}
                        values={leashOptions}
                        handleChange={this.handleChange}
                        required={false}
                        label={"On Leash"}
                        id={"onLeash"}
                      />
                    </div>
                  ) : null}
                </div>

                <div className="formItem">
                  <h4>Where did you observe the carnivore?</h4>
                  <FormSelect
                    selectedValue={vantagePoint}
                    values={vantagePoints}
                    handleChange={this.handleChange}
                    required={false}
                    label={"Vantage Point"}
                    id={"vantagePoint"}
                  />
                </div>
              </div>
            )}
            <hr />
          </div>
          <br />

          {/*Animal behavior*/}
          <div>
            {/* Species Identification Tips */}
            {this.getCollapse(
              classes,
              "Animal Behavior (Optional)",
              this.toggleShow("showAnimalBehavior"),
              showAnimalBehavior,
              <div>
                <div className="formItem">
                  <h4>What was it doing?</h4>
                  <FormSelect
                    selectedValue={animalBehavior}
                    values={animalBehaviors}
                    handleChange={this.handleChange}
                    required={false}
                    label={"Animal Behavior"}
                    id={"animalBehavior"}
                  />
                  {animalBehavior === "Was eating" ? (
                    <TextValidator
                      label="What it was eating (if observed):"
                      multiline
                      style={{ minWidth: "300px" }}
                      rows="4"
                      value={animalEating}
                      inputProps={{
                        name: "animalEating",
                        id: "animalEating",
                        maxLength: 80,
                      }}
                      onChange={this.handleChange}
                      margin="normal"
                      variant="outlined"
                    />
                  ) : null}
                </div>

                <div className="formItem">
                  <h4>Did it vocalize?</h4>
                  <FormSelect
                    selectedValue={vocalization}
                    values={vocalizations}
                    handleChange={this.handleChange}
                    required={false}
                    label={"Vocalization"}
                    id={"vocalization"}
                  />
                  {vocalization === "Other" ? (
                    <TextValidator
                      label="Describe (limit 80 char)"
                      multiline
                      required
                      rows="4"
                      value={vocalizationDesc}
                      inputProps={{
                        name: "vocalizationDesc",
                        id: "vocalizationDesc",
                        maxLength: 80,
                      }}
                      onChange={this.handleChange}
                      margin="normal"
                      variant="outlined"
                    />
                  ) : null}
                </div>

                <div className="formItem" id="carnivoreResponse">
                  <h4>How did it react?</h4>
                  <FormSelect
                    selectedValue={carnivoreResponse}
                    values={carnivoreResponses}
                    handleChange={this.handleChange}
                    required={false}
                    label={"Carnivore Response"}
                    id={"carnivoreResponse"}
                  />
                </div>
                <div className="formItem" id="carnivoreConflict">
                  <h4>
                    Was there an interaction with the observer, pets/livestock
                    or other items?
                  </h4>
                  <FormSelect
                    selectedValue={carnivoreConflict}
                    values={conflictOptions}
                    handleChange={this.handleChange}
                    required={false}
                    label={"Carnivore Conflict"}
                    id={"carnivoreConflict"}
                  />
                  {conflictOptions.indexOf(carnivoreConflict) === 0 ||
                    conflictOptions.indexOf(carnivoreConflict) === 2 ? (
                      <TextValidator
                        label="Describe (limit 80 char)"
                        multiline
                        style={{ minWidth: "300px" }}
                        rows="4"
                        value={conflictDesc}
                        inputProps={{
                          name: "conflictDesc",
                          id: "conflictDesc",
                          maxLength: 80,
                        }}
                        onChange={this.handleChange}
                        margin="normal"
                        variant="outlined"
                      />
                    ) : null}
                </div>
              </div>
            )}
            <hr />
          </div>
          <br />

          {/*Contact*/}
          <div>
            {/* Species Identification Tips */}
            {this.getCollapse(
              classes,
              "Contact Information (Optional)",
              this.toggleShow("showContactInformation"),
              showContactInformation,
              <div>
                <div className="formItem">
                  <p>
                    {" "}
                    This information will not be shared and will be available to
                    project coordinators only.
                  </p>
                  <div>
                    <TextValidator
                      value={contactName}
                      style={{ minWidth: "300px", marginBottom: "15px" }}
                      variant="outlined"
                      label="Name"
                      onChange={this.handleChange}
                      inputProps={{
                        name: "contactName",
                        id: "contactName",
                      }}
                    ></TextValidator>
                  </div>
                  <div>
                    <TextValidator
                      value={contactEmail}
                      variant="outlined"
                      label="Email"
                      style={{ minWidth: "300px", marginBottom: "15px" }}
                      onChange={this.handleChange}
                      validators={["isEmail"]}
                      errorMessages={["Email is not valid"]}
                      inputProps={{
                        name: "contactEmail",
                        id: "contactEmail",
                      }}
                    ></TextValidator>
                  </div>
                  <TextValidator
                    value={contactPhone}
                    variant="outlined"
                    label="Phone Number"
                    style={{ minWidth: "300px" }}
                    onChange={this.handleChange}
                    inputProps={{
                      name: "contactPhone",
                      id: "contactPhone",
                    }}
                  ></TextValidator>
                </div>
              </div>
            )}
            <hr />
          </div>
          <br />

          <div className="formItem">
            <h4>Comments (Optional)</h4>
            <TextValidator
              value={generalComments}
              style={{ minWidth: "300px" }}
              variant="outlined"
              label="General Comments"
              onChange={this.handleChange}
              inputProps={{
                name: "generalComments",
                id: "generalComments",
              }}
            ></TextValidator>
          </div>
          <Button variant="contained" type="submit" color="primary">
            Submit
          </Button>
        </ValidatorForm>
        {this.getDialogFromMode(dialogMode)}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { isMobile: state.isMobile };
};

export default withRouter(withStyles(styles)(connect(mapStateToProps)(Form)));
