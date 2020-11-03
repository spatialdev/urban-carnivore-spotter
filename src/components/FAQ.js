import React, { Component } from "react";
import { withStyles } from "@material-ui/core";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import contactImage from "../assets/Raccoon-Thinking.svg";

const styles = {
  mobileFaqWrapper: {
    backgroundColor: "#F6F4F3",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
  },
  mobileContact: {
    order: 2,
    backgroundColor: "white",
    marginTop: "2em",
    width: "auto",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
  },
  mobileFaqCard: {
    order: 1,
    textAlign: "left",
    backgroundColor: "white",
    width: "auto",
    padding: "1em 2em",
  },
  faqWrapper: {
    backgroundColor: "#F6F4F3",
    height: "100vh",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
  },
  contact: {
    backgroundColor: "white",
    margin: "0 2em",
    width: "247px",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    borderRadius: "8px",
    boxShadow: "1px 1px 5px #d3d3d3",
    marginBottom: "2em",
  },
  contactHeader: {
    color: "#0877C6",
    padding: "1em 2em",
  },
  contactBody: {
    color: "rgba(2, 2, 30, 0.6)",
    padding: "0 2em 5em 2em",
    fontWeight: "600",
  },
  contactImage: { alignSelf: "flex-end" },
  faqCard: {
    textAlign: "left",
    backgroundColor: "white",
    width: "716px",
    height: "631px",
    padding: "1em 2em",
    overflow: "auto",
    marginBottom: "2em",
  },
  faqCardBody: {
    margin: "2em 0",
  },
  qAndA: {
    display: "flex",
    flexDirection: "column",
  },
  q: {
    color: "rgba(2,2,30,0.85)",
    fontWeight: 600,
    letterSpacing: "0.5px",
    fontSize: "1em",
    margin: "1em 0",
  },
  a: {
    color: "rgba(2,2,30,0.7)",
    fontWeight: 500,
    letterSpacing: "0.44px",
    fontSize: "0.9em",
  },
};

class FAQ extends Component {
  state = {
    qAndA: [
      {
        question: "Why am I having issues with reporting my observation?",
        answer:
          "This could be a result of the browser you are using (ie. Internet Explorer), try using a different browser. If that does not work, we suggest updating your browser to the latest version.",
      },
      {
        question: "Can I still report if my neighborhood isn't listed?",
        answer:
          "The neighborhood filter allows users to easily locate sightings within their neighborhood area. This list of neighborhoods automatically updates to reflect all the current neighborhoods with reports. If your neighborhood is not listed it means that no one has submitted a report yet or it is not included within the basemap that we are currently using. Please submit your carnivore sighting and, once verified by our team, your neighborhood will appear on the list. Our list of neighborhood names comes from an online database, so it is also possible that your neighborhood is listed under a different name or included within a large neighborhood, city or county.",
      },
      {
        question: "Why isn't my photo showing up immediately?",
        answer:
          "After you submit a report with or without media, there is a 10-day delay period. This delay period allows the Carnivore Spotter team to verify reports. At this time we can only verify observations with photos, videos or audio files, but all reports are reviewed.",
      },
      {
        question: "Can I report if I live outside of Seattle?",
        answer:
          "The current focus area of Carnivore Spotter is the greater Seattle area. Feel free to submit your reports outside of these areas, but these reports may not be included in the project as a whole at this time.",
      },
      {
        question: "Do I need to include a photo?",
        answer:
          "While we highly encourage you to submit a report with media, it is not required. By including media (photo, video, audio) with your report, you are increasing the confidence of your carnivore sighting. Every report is reviewed by the Carnivore Spotter team and those with media are verified for accuracy.",
      },
      {
        question:
          "Why haven’t you included other species such as martens, minks or weasels?",
        answer:
          "We’ve included species that tend to occur within or adjacent to developed regions and are generally easy for the public to identify. Some carnivore species, therefore, have necessarily been omitted.",
      },
      {
        question:
          "Why haven’t you included other animals that are carnivorous (such as birds of prey)?",
        answer:
          "Carnivore Spotter and the larger Seattle Urban Carnivore Project is focused on how urban carnivores -  such as coyotes, raccoons and bobcats - live and interact with people across greater Seattle. While we appreciate the importance of other carnivorous animals such as birds of prey, the primary focus of this project is to further understand and support coexistence with the eight focal species of terrestrial mammalian carnivores (coyote, bobcat, raccoon, black bear, cougar, river otter, red fox and opossum).",
      },
      {
        question: "I cannot select my location on the sight reporting map.",
        answer:
          "Please follow these tips to ensure you are selecting an accurate location for your carnivore sighting: 1) Be sure to select the blue “Edit Location” button on mobile devices. 2) Drag the red point to your sighting location, the map should follow 3) Zoom in/out by “pinching” fingers on a mobile device, or “scrolling” on a desktop mouse",
      },
      {
        question:
          "How do I know if the reports on Carnivore Spotter are accurate?",
        answer:
          "Only reports that include media (photos, video, audio) can be verified by project staff, but all reports of the eight focal species are included on the map. If you want to see only verified reports, you can use the filter to select only those reports that have photos, videos or audio and are thus verified reports.",
      },
    ],
  };
  render() {
    const { classes, isMobile } = this.props;
    const { qAndA } = this.state;
    return (
      <div className={isMobile ? classes.mobileFaqWrapper : classes.faqWrapper}>
        <div className={isMobile ? classes.mobileContact : classes.contact}>
          <h3 className={classes.contactHeader}>
            Can’t find the answer you are looking for?
          </h3>
          <div className={classes.contactBody}>
            Contact us: seattlecarnivores@zoo.org
          </div>
          <img
            className={classes.contactImage}
            src={contactImage}
            alt="Raccoon Thinking Icon"
          />
        </div>
        <div className={isMobile ? classes.mobileFaqCard : classes.faqCard}>
          <h3>Frequently Asked Questions</h3>
          <div className={classes.faqCardBody}>
            {qAndA.map(({ question, answer }) => {
              return (
                <div className={classes.qAndA}>
                  <div className={classes.q}>{question}</div>
                  <div className={classes.a}>{answer}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { isMobile: state.isMobile };
};

export default withRouter(withStyles(styles)(connect(mapStateToProps)(FAQ)));
