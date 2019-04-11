import React from 'react';
import { FormControlLabel, FormGroup, FormControl, Checkbox } from '@material-ui/core';

class FilterCheckboxes extends React.Component {
    
    constructor(props) {
        super(props);
        
        // Initialize carnivore and neighborhood state
        const {allItems} = this.props;
        const defaultFilter = {};
        allItems.forEach(item => defaultFilter[item] = false);
        this.state = {
            showAllItems: true,
            itemFilter: defaultFilter
        }
    }

    toggleAllItems = () => {
        const {updateValues} = this.props;
        const {showAllItems, itemFilter} = this.state;
        if (showAllItems) {
            this.setState(state => {
                // if we currently have all items on, then we want to go back to the plain itemFilter
                updateValues(itemFilter);
                return ({...state,
                    showAllItems: false
                })
            });
        } else {
            this.setState(state => {
                // otherwise, everything should be true
                const allTrue = {};
                Object.keys(itemFilter).forEach(key => allTrue[key] = true);
                updateValues(allTrue);
                return ({...state,
                    showAllItems: true
                })}
            );
        }
    }

    toggleItem = (itemName) => () => {
        const {updateValues} = this.props;
        this.setState(state => {
            const newState = {...state,
                itemFilter: {...state.itemFilter,
                    [itemName]: !state.itemFilter[itemName]}};
            // If we're toggling an item, then showAllItems must be false, so we can safely update the parent value. 
            updateValues(newState.itemFilter);
            return newState;
        });
    }

    // props: label, callback to update state, all items, number of items to show without expanding
    render() {
        const {allLabel, briefNumber} = this.props;
        const {itemFilter, showAllItems} = this.state;
        return <FormControl component="fieldset">
            <FormGroup>
                <FormControlLabel
                    control={<Checkbox checked={showAllItems} onChange={this.toggleAllItems}/>}
                    label={allLabel} />
                {Object.keys(itemFilter).slice(0, briefNumber).map(item =>
                    <FormControlLabel key={item} 
                        control={<Checkbox 
                            checked={itemFilter[item]} 
                            onChange={this.toggleItem(item)}
                            disabled={showAllItems}/>} label={item}/>
                )}
            </FormGroup>
        </FormControl>
    }
}

export default FilterCheckboxes;