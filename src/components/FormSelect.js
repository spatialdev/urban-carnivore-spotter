import React from 'react';
import {SelectValidator} from "react-material-ui-form-validator";
import {connect} from "react-redux";
import MenuItem from '@material-ui/core/MenuItem';

const FormSelect = (props) => {
  const {selectedValue, values, handleChange, required, label, id, isMobile, style, wrapText} = props;

  const validators = required ? ['required'] : [];
  const errorMessages = required ? ['This field is required'] : [];
  const children = isMobile ? <>
      <optgroup label={""}>
        <option value={""}/>
        {values.map((level, idx) => <option key={idx} value={level}>{level}</option>)}
      </optgroup>
    </> :
    values.map((level, idx) => <MenuItem style={wrapText ? {whiteSpace: 'normal', marginBottom: '10px'} : {}}
                                         key={idx} value={level}>{level}</MenuItem>);

  return <SelectValidator
              SelectProps={{native: isMobile}}
              value={selectedValue}
              style={{ minWidth: '300px', maxWidth: 300, ...style }}
              validators={validators}
              errorMessages={errorMessages}
              variant="outlined"
              label={label}
              onChange={handleChange}
              inputProps={{
                name: id,
                id: id,
              }}
            >
    {children}
  </SelectValidator>
};

const mapStateToProps = (state) => {
  return { isMobile: state.isMobile };
};

export default (connect(mapStateToProps)(FormSelect));