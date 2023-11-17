import React, { Component } from 'react';
import PropTypes from 'prop-types';

class InputPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
    };
  }

  buttonChangeHandler() {
    this.setState({
      show: !this.state.show,
    });
  }

  render() {
    const {
        name, placeholder, value, maxlength, disabled, required,
        changeEvent
    } = this.props;
    const { show } = this.state;

    return (
        <div className="input-group">
            <input
                type={show ? 'text' : 'password'}
                className="form-control"
                name={name}
                placeholder={placeholder}
                onChange={(e) => changeEvent(e.target.value, e)}
                value={value}
                maxLength={maxlength}
                disabled={disabled}
                required={!!required}
            />
            <div className="input-group-append">
                <div className="input-group-text">
                    <span
                        className={
                            show ? 'fas fa-solid fa-eye' : "fas fa-solid fa-eye-slash"
                        }
                        style={{ cursor: 'pointer' }}
                        onClick={() => this.buttonChangeHandler()}
                    />
                </div>
            </div>
        </div>
    );
  }
}

InputPassword.propTypes = {
  label: PropTypes.string,
  classes: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  changeEvent: PropTypes.func,
  required: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
};

InputPassword.defaultProps = {
    required: false,
};

export default InputPassword;
