import React from 'react';
import PropTypes from 'prop-types';

const InputTextIcon = (props) => {
    const {
        value, type, name, changeEvent, placeholder, required, disabled, maxlength,
        icon,
    } = props;

    return (
        <div className="input-group">
            <input
                type={type}
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
                    <span className={icon} />
                </div>
            </div>
        </div>
    );
};

InputTextIcon.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    maxlength: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    changeEvent: PropTypes.func,
    required: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]),
    disabled: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]),
    readonly: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]),
    title: PropTypes.string,
    spellCheck: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]),
    icon: PropTypes.string,
};

InputTextIcon.defaultProps = {
    label: '',
    type: 'text',
    name: undefined,
    placeholder: '',
    maxlength: '',
    changeEvent: () => {},
    required: false,
    disabled: false,
    readonly: false,
    title: '',
    spellCheck: false,
    icon: 'fas fa-solid fa-circle',
};

export default InputTextIcon;
