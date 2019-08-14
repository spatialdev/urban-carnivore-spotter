import React from "react";
import {Dialog, DialogContent} from "@material-ui/core";
import {withStyles} from "@material-ui/core";
import {withCookies} from "react-cookie";
import isSupported from "@mapbox/mapbox-gl-supported";

const SEEN_UNSUPPORTED_BROWSER_BEFORE = "seenUnsupportedBrowserBefore";

const styles = {
  bulleted: {
    listStyleType: 'disc'
  }
};

const UnsupportedBrowserNotice = (props) => {
  const {cookies} = props;
  return <Dialog open={!cookies.get(SEEN_UNSUPPORTED_BROWSER_BEFORE) && !isSupported({})}
          onClose={() => cookies.set(SEEN_UNSUPPORTED_BROWSER_BEFORE, true)}>
    <DialogContent>
      We've detected that you are using a browser that does not support WebGL, so the map may not render properly.
      Please consider using a browser that supports WebGL, such as Firefox, Safari, Edge, or Chrome.
    </DialogContent>
  </Dialog>
};

export default withStyles(styles)(withCookies(UnsupportedBrowserNotice));