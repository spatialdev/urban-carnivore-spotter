import React, { Component } from "react";
import {
  FormControlLabel,
  FormGroup,
  FormControl,
  Checkbox,
  Button,
  Collapse,
  Typography,
} from "@material-ui/core";
import CheckBoxIntermediateIcon from "mdi-react/CheckboxIntermediateIcon";
import { withStyles } from "@material-ui/core/styles";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PlaceIcon from "@material-ui/icons/Place";

const styles = {
  checkedCheckbox: {
    color: "#93C838",
  },
  showAllButton: {
    width: "fitContent",
    margin: "auto",
  },
  showAllButtonWrapper: {
    allContent: "left",
  },
  allContent: {
    padding: "0px 0px 0px 24px",
    width: "100%",
  },
  formControlLabel: {
    fontSize: "0.85em",
    fontFamily: "Raleway",
    color: "#767676",
    fontWeight: 500,
  },
};

class FilterCheckboxes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewAll: false,
    };
  }

  getButton = (itemKey, checked, onChange, classes, keyColorFunction) => {
    const label = keyColorFunction ? (
      <span>
        <PlaceIcon style={{ color: keyColorFunction(itemKey) }} />
        {itemKey}
      </span>
    ) : (
      <span>{itemKey}</span>
    );
    return (
      <FormControlLabel
        key={itemKey}
        control={
          <Checkbox
            checkedIcon={
              <CheckBoxIntermediateIcon className={classes.checkedCheckbox} />
            }
            checked={checked}
            onChange={onChange}
          />
        }
        label={
          <Typography className={classes.formControlLabel}>{label}</Typography>
        }
        className={classes.formControlLabel}
      />
    );
  };

  orderEntries = (filter) => {
    return (
      Object.entries(filter)
        // Sort the entries by their order
        .sort(
          ([aKey, aValue], [otherKey, otherValue]) =>
            aValue.order - otherValue.order
        )
    );
  };

  render() {
    const {
      allLabel,
      briefNumber,
      filter,
      updateValues,
      classes,
      keyColorFunction,
    } = this.props;
    const { viewAll } = this.state;
    return (
      <FormControl component="fieldset" className={classes.allContent}>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={filter["all"].value}
                onChange={() => updateValues("all", !filter["all"].value)}
                checkedIcon={
                  <CheckBoxIntermediateIcon
                    className={classes.checkedCheckbox}
                  />
                }
              />
            }
            label={
              <Typography className={classes.formControlLabel}>
                {allLabel}
              </Typography>
            }
          />
          {this.orderEntries(filter)
            .filter(([key, value]) => key !== "all")
            .slice(0, briefNumber)
            .map(([itemKey, itemState]) =>
              this.getButton(
                itemKey,
                itemState.value,
                () => updateValues(itemKey, !itemState.value),
                classes,
                keyColorFunction
              )
            )}
        </FormGroup>
        {/* Button to display the rest. Subtracting 1 to account for the all button, which has a field in filter
                but doesn't count towards the briefNumber total since it's rendered separately. */}
        {briefNumber !== Object.keys(filter).length - 1 ? (
          <>
            <Collapse in={viewAll}>
              <FormGroup>
                {this.orderEntries(filter)
                  .filter(([key, value]) => key !== "all")
                  .slice(briefNumber)
                  .map(([itemKey, itemState]) =>
                    this.getButton(
                      itemKey,
                      itemState.value,
                      () => updateValues(itemKey, !itemState.value),
                      classes
                    )
                  )}
              </FormGroup>
            </Collapse>
            <div className={classes.showAllButtonWrapper}>
              <Button
                onClick={() =>
                  this.setState((state) => ({
                    ...state,
                    viewAll: !state.viewAll,
                  }))
                }
                className={classes.showAllButton}
              >
                {viewAll ? (
                  <>
                    Hide Some <ExpandLessIcon />
                  </>
                ) : (
                  <>
                    Show All <ExpandMoreIcon />
                  </>
                )}
              </Button>
            </div>
          </>
        ) : null}
      </FormControl>
    );
  }
}

export default withStyles(styles)(FilterCheckboxes);
