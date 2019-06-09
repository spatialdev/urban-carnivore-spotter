import React, {Component} from 'react';
import { FormControlLabel, FormGroup, FormControl, Checkbox, Button, Collapse } from '@material-ui/core';
import CheckBoxIntermediateIcon from 'mdi-react/CheckboxIntermediateIcon';
import { withStyles } from '@material-ui/core/styles';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PlaceIcon from '@material-ui/icons/Place';

const styles = {
    checkbox: {
        margin: '0px 0px 0px 8px',
    },
    checkedCheckbox: {
        color: '#93C838'
    },
    showAllButton: {
        margin: 'auto'
    },
    allContent: {
        width: '100%'
    }
};

class FilterCheckboxes extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewAll: false
        };
    }

    getButton = (itemKey, checked, disabled, onChange, classes, keyColorFunction) => {
        const label = keyColorFunction ? <span><PlaceIcon style={{color: keyColorFunction(itemKey)}}/>{itemKey}</span> : <span>{itemKey}</span>;
        return <FormControlLabel key={itemKey}
                    control={<Checkbox
                        checkedIcon={<CheckBoxIntermediateIcon className={classes.checkedCheckbox}/>}
                        checked={checked}
                        onChange={onChange}
                        disabled={disabled}
                        className={classes.checkbox}/>} label={label}/>
    };

    render() {
        const {allLabel, briefNumber, filter, updateValues, classes, keyColorFunction} = this.props;
        const {viewAll} = this.state;
        return <FormControl component="fieldset" className={classes.allContent}>
            <FormGroup>
                <FormControlLabel
                    control={<Checkbox checked={filter['all']}
                                onChange={() => updateValues('all', !filter['all'])}
                                checkedIcon={<CheckBoxIntermediateIcon className={classes.checkedCheckbox}/>}
                                className={classes.checkbox}/>}
                    label={allLabel} />
                {Object.entries(filter)
                    .filter(([key, value]) => key !== 'all').slice(0, briefNumber).map(([itemKey, checked]) =>
                    this.getButton(itemKey, checked, filter['all'], () => updateValues(itemKey, !checked), classes, keyColorFunction)
                )}
            </FormGroup>
            {/* Button to display the rest. Subtracting 1 to account for the all button, which has a field in filter
                but doesn't count towards the briefNumber total since it's rendered separately. */}
            {briefNumber !== Object.keys(filter).length - 1 ?
                <>
                <Collapse in={viewAll}>
                    <FormGroup>
                        {Object.entries(filter).filter(([key, value]) => key !== 'all').slice(briefNumber)
                            .map(([itemKey, checked]) =>
                                this.getButton(itemKey, checked, filter['all'], () => updateValues(itemKey, !checked), classes))}
                    </FormGroup>
                </Collapse>
                <Button
                    onClick={() => this.setState(state => ({...state, viewAll: !state.viewAll}))}
                    className={classes.showAllButton}>
                    {viewAll ? <>Hide Some <ExpandLessIcon/></> : <>Show All <ExpandMoreIcon/></>}</Button>
                </>
                : null}
        </FormControl>
    }
}

export default withStyles(styles)(FilterCheckboxes)
