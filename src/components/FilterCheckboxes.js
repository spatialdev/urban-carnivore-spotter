import React, {Component} from 'react';
import { FormControlLabel, FormGroup, FormControl, Checkbox, Button, Collapse } from '@material-ui/core';
import CheckBoxIntermediateIcon from 'mdi-react/CheckboxIntermediateIcon'

export default class FilterCheckboxes extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewAll: false
        }
    }

    getButton = (itemKey, checked, disabled, onChange) => {
        return <FormControlLabel key={itemKey}
                    control={<Checkbox
                        checkedIcon={<CheckBoxIntermediateIcon/>}
                        checked={checked}
                        onChange={onChange}
                        disabled={disabled}/>} label={itemKey}/>
    }

    render() {
        const {allLabel, briefNumber, filter, updateValues} = this.props;
        const {viewAll} = this.state;
        return <FormControl component="fieldset">
            <FormGroup>
                <FormControlLabel
                    control={<Checkbox checked={filter['all']}
                                onChange={() => updateValues('all', !filter['all'])}
                                checkedIcon={<CheckBoxIntermediateIcon/>}
                                />}
                    label={allLabel} />
                {Object.entries(filter)
                    .filter(([key, value]) => key != 'all').slice(0, briefNumber).map(([itemKey, checked]) =>
                    this.getButton(itemKey, checked, filter['all'], () => updateValues(itemKey, !checked))
                )}
                {/* Button to display the rest. Subtracting 1 to account for the all button, which has a field in filter
                    but doesn't count towards the briefNumber total since it's rendered separately. */}
                {briefNumber !== Object.keys(filter).length - 1 ?
                    <>
                    <Collapse in={viewAll}>
                        {Object.entries(filter).filter(([key, value]) => key != 'all').slice(briefNumber)
                            .map(([itemKey, checked]) =>
                                this.getButton(itemKey, checked, filter['all'], () => updateValues(itemKey, !checked)))}
                    </Collapse>
                    <Button onClick={() => this.setState(state => ({...state, viewAll: !state.viewAll}))}>
                        {viewAll ? 'Hide Some' : 'Show All'}</Button>
                    </>
                    : null}
            </FormGroup>
        </FormControl>
    }
}
