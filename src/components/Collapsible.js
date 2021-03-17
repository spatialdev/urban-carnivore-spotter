import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Collapse } from "@material-ui/core";
import ResizableIconButton from "./ResizableIconButton";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

const styles = {
  expandHeader: {
    margin: "1em",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: 600,
    color: "rgba(57,57,57,0.9)",
    letterSpacing: "0.58px",
    "&:hover": {
      color: "black !important",
    },
    "&:active": {
      color: "black !important",
    },
    "&:focus": {
      color: "black !important",
    },
  },
  headerTitle: {
    alignText: "left",
  },
  collapsible: {
    textAlign: "left",
  },
  separator: {
    margin: "0 1em",
    borderColor: "rgba(242, 242, 242, 0.25)",
  },
  resizeButton: {
    width: "0.25em",
    height: "0.25em",
    backgroundColor: "#F6F4F3",
    color: "#757575 !important",
    "&:hover": {
      backgroundColor: "#8DCA22",
      color: "white !important",
    },
    "&:active": {
      backgroundColor: "#8DCA22",
      color: "white !important",
    },
    "&:focus": {
      backgroundColor: "#8DCA22",
      color: "white !important",
    },
  },
};

class Collapsible extends React.Component {
  constructor ( props ) {
    super( props );
    this.state = {};
  }

  render () {
    const { classes, headerTitle, onClick, expand, children } = this.props;
    return (
      <>
        <div className={ classes.expandHeader }>
          <span className={ classes.headerTitle }>{ headerTitle }</span>
          <ResizableIconButton
            onClick={ onClick }
            disableRipple={ true }
            className={ classes.resizeButton }
            color={ "white" }
          >
            { expand ? <RemoveIcon /> : <AddIcon /> }
          </ResizableIconButton>
        </div>
        <Collapse in={ expand } className={ classes.collapsible }>
          { children }
        </Collapse>
        <hr className={ classes.separator } />
      </>
    );
  }
}


export default withStyles( styles )( Collapsible );
