import React from "react";
import { Dialog, DialogContent } from "@material-ui/core";
import { withStyles } from "@material-ui/core";
import { withCookies } from "react-cookie";
const VISITED_BEFORE = "visitedBefore";

const styles = {
  title: {
    fontWeight: "600",
    fontSize: "1.1em",
    fontFamily: "Raleway",
    lineHeight: 1.4,
  },
  text: {
    fontFamily: "Raleway",
    fontSize: "0.85em",
    lineHeight: 1.4,
  },
  italicText: {
    fontFamily: "Raleway",
    fontSize: "0.8em",
    fontStyle: "italic",
    color: "rgba(0,0,0,0.6)",
    lineHeight: 1.4,
  },
  bulletedTitle: {
    fontWeight: "600",
    fontSize: "0.9em",
    fontFamily: "Raleway",
    lineHeight: 1.4,
  },
  bulleted: {
    listStyleType: "disc",
    fontFamily: "Raleway",
    fontSize: "0.85em",
    lineHeight: 1.4,
    "&::marker": {
      color: "#8DCA22",
      fontWeight: "bold",
    },
  },
};

const SplashPage = (props) => {
  const { cookies, classes } = props;
  return (
    <Dialog
      open={!cookies.get(VISITED_BEFORE)}
      onClose={() => cookies.set(VISITED_BEFORE, true)}
    >
      <DialogContent>
        <h4 className={classes.title}>Welcome to Carnivore Spotter!</h4>
        {window.location.pathname.indexOf("tacoma") === -1 ? (
          <p className={classes.text}>
            The Seattle Urban Carnivore project is a partnership between
            Woodland Park Zoo and Seattle University and aims to explore how
            mammalian carnivores live and interact with people across urban and
            suburban areas in the Seattle region.
          </p>
        ) : (
          <p className={classes.text}>
            Thank you for reporting your sightings of coyotes and other
            carnivores! This information is essential for helping us gain a
            better understanding of our wild neighbors.​
            <br />​<br />
            Carnivore Spotter gathers sightings from throughout Western
            Washington to learn how mammalian carnivores live and interact with
            people in our region. These studies are being undertaken by
            researchers at Point Defiance Zoo & Aquarium, Northwest Trek
            Wildlife Park, Woodland Park Zoo, University of Washington Tacoma
            and Seattle University.
          </p>
        )}
        <p className={classes.bulletedTitle}>
          The project focuses on the following species:
        </p>
        <ul>
          <li className={classes.bulleted}>Black Bear</li>
          <li className={classes.bulleted}>Bobcat</li>
          <li className={classes.bulleted}>Cougar / Mountain Lion</li>
          <li className={classes.bulleted}>Coyote</li>
          <li className={classes.bulleted}>Opossum</li>
          <li className={classes.bulleted}>Raccoon</li>
          <li className={classes.bulleted}>River Otter</li>
          <li className={classes.bulleted}>Red Fox</li>
        </ul>
        <p className={classes.italicText}>
          These are terrestrial (not marine) mammals in the taxonomic order
          Carnivora (*except for opossums). Some of them have a carnivorous diet
          (eating other animals). Many of them, however, have an omnivorous
          diet, eating plants as well as animals.
        </p>
        <p className={classes.text}>
          You can use this observation form to submit observations of any of the
          above animals (or if you think you may have seen one of them, but
          aren’t sure!) We encourage reports with photos, videos or audio to
          increase report confidence.
        </p>
        <p className={classes.text}>
          Each dot on this map represents an observation submitted to Carnivore
          Spotter; there may be multiple observations of individual animals.
          Every report is reviewed by project staff, but only those with media
          (photos, video or audio) can be verified for accuracy.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default withStyles(styles)(withCookies(SplashPage));
