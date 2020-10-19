import { ValidatorComponent } from 'react-material-ui-form-validator';
import ResizableIconButton from './ResizableIconButton';
import Info from '@material-ui/icons/InfoOutlined';
import React from 'react';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';

const styles = (theme) => ({
  radioButtonContainerMobile: {
    display: 'flex',
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    paddingLeft: 35,
    paddingRight: 35,
  },
  radioButtonContainer: {
    display: 'flex',
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'spaceBetween',
    paddingLeft: '35%',
    paddingRight: '35%',
    position: 'relative',
  },
});

class FormRadioButtons extends ValidatorComponent {
  renderValidatorComponent() {
    const {
      errorMessages,
      validators,
      requiredError,
      value,
      species,
      classes,
      isMobile,
      onChangeSelection,
      onClickInfo,
    } = this.props;
    return (
      <div>
        {this.errorText()}
        {species.map((type, idx) => (
          <span
            className={
              isMobile
                ? classes.radioButtonContainerMobile
                : 'radioButtonContainer'
            }
            key={idx}
          >
            <div>
              <label>
                <input
                  type='radio'
                  name='react-tips'
                  value={type}
                  onChange={onChangeSelection(type)}
                />
                {type}
              </label>
            </div>
            <div>
              <ResizableIconButton
                onClick={onClickInfo(idx)}
                backgroundColor={'white'}
                color={'#4385E9'}
              >
                <Info />
              </ResizableIconButton>
            </div>
          </span>
        ))}
      </div>
    );
  }

  errorText = () => {
    const { isValid } = this.state;
    if (isValid) {
      return null;
    }
    return <div style={{ color: 'red' }}>{this.getErrorMessage()}</div>;
  };
}

const mapStateToProps = (state) => {
  return { isMobile: state.isMobile };
};

export default withStyles(styles)(connect(mapStateToProps)(FormRadioButtons));
