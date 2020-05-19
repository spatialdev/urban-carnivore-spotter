import React from "react";
import {Dialog, DialogContent} from "@material-ui/core";
import {withStyles} from "@material-ui/core";
import {withCookies} from "react-cookie";
const VISITED_BEFORE = "visitedBefore";

const styles = {
  bulleted: {
    listStyleType: 'disc'
  }
};

const SplashPage = (props) => {
  const {cookies, classes} = props;
  return <Dialog open={!cookies.get(VISITED_BEFORE)}
          onClose={() => cookies.set(VISITED_BEFORE, true)}>
    <DialogContent>
        {window.location.pathname.indexOf('tacoma') === -1 ?
            <p>The Seattle Urban Carnivore project is a partnership between Woodland Park Zoo and Seattle University and aims to explore how mammalian carnivores live and interact with people across urban and suburban areas in the Seattle region.</p>:
            <p>Thank you for reporting your sightings of coyotes and other carnivores! This information is essential for helping us gain a better understanding of our wild neighbors.​<br/>Carnivore Spotter gathers sightings from throughout Western Washington to learn how mammalian carnivores live and interact with people in our region. These studies are being undertaken by researchers at Point Defiance Zoo & Aquarium, Northwest Trek Wildlife Park, Woodland Park Zoo, University of Washington Tacoma and Seattle University.
            </p>}
      <p>The project focuses on the following species:</p>
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
      <p>These are terrestrial (not marine) mammals in the taxonomic order Carnivora (*except for opossums). Some of them have a carnivorous diet (eating other animals). Many of them, however, have an omnivorous diet, eating plants as well as animals.</p>
      <p>You can use this observation form to submit observations of any of the above animals (or if you think you may have seen one of them, but aren’t sure!)</p>
    </DialogContent>
  </Dialog>
};

export default withStyles(styles)(withCookies(SplashPage));