import React from 'react';
import PropTypes from 'prop-types';

const InputToggle = ({
    label, idInput, value, changeEvent, disabled,
}) => (
    <div className="custom-control custom-switch">
        <input
            type="checkbox"
            className="custom-control-input"
            disabled={disabled}
            id={idInput}
            checked={value}
            onChange={e => { changeEvent(e.target.checked, e) }}
        />
        <label
            className="custom-control-label"
            htmlFor={idInput}
        >
            {label}
        </label>
    </div>
)

InputToggle.propTypes = {
    title: PropTypes.string,
    idInput: PropTypes.string,
    disabled: PropTypes.bool,
    changeEvent: PropTypes.func,
};

InputToggle.defaultProps = {
    idInput: 'customSwitch1',
    disabled: false,
    changeEvent: () => {},
};

export default InputToggle;
