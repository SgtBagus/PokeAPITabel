import React from 'react';
import PropTypes from 'prop-types';

class InputTextArea extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.changeEvent(event.target.value, event);
  }

  render() {
    const {
      label,
      value,
      maxLengthCounter,
      maxlength,
      row,
      classes,
      name,
      placeholder,
      required,
      disabled,
      readonly,
      resize,
    } = this.props;

    return (
      <div className="form-group">
        {label && (
            <div className="row">
                <div className={(maxLengthCounter && maxlength) ? 'col-xs-6' : 'col-xs-12'}>
                    <label className="control-label">{label}</label>
                </div>
                {(maxLengthCounter && maxlength) && (
                    <div className="col-xs-6 text-right">
                        <label className="control-label">{`${value.length}/${maxlength}`}</label>
                    </div>
                )}
            </div>
        )}
        <div className="text-input-wrap">
          <textarea
            className={`${classes} form-control`}
            name={name}
            onChange={this.handleChange}
            placeholder={placeholder}
            required={!!required}
            disabled={disabled}
            value={value}
            rows={row === undefined ? 3 : row}
            maxLength={maxlength}
            readOnly={readonly}
            style={{ resize: resize || 'none' }}
          />
        </div>
      </div>
    );
  }
}

InputTextArea.propTypes = {
  label: PropTypes.string,
  classes: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
  ]).isRequired,
  changeEvent: PropTypes.func,
  maxLengthCounter: PropTypes.bool,
  maxlength: PropTypes.string,
  row: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  resize: PropTypes.string,
};

InputTextArea.defaultProps = {
  label: '',
  classes: undefined,
  placeholder: '',
  changeEvent: () => {},
  maxLengthCounter: false,
  maxlength: '',
  row: undefined,
  name: undefined,
  required: false,
  disabled: false,
  readonly: false,
  resize: undefined,
};

export default InputTextArea;
