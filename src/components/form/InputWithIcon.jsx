import React from 'react';
import PropTypes from 'prop-types';

const InputWithIcon = (props) => {
    const {
        value, classes, name, changeEvent, placeholder, required, disabled, maxlength, readonly, title, spellCheck,
        type, icon,
    } = props;

    let inputStyleClass = 'form-control';

    if (classes) {
        inputStyleClass = `${inputStyleClass} ${classes}`;
    }

    return (
        <div className="input-group">
            <div className="input-group-prepend">
                <span className="input-group-text">
                    <i className={icon} />
                </span>
            </div>
            <input
                type={type}
                className={inputStyleClass}
                name={name}
                onChange={e => changeEvent(e.target.value, e)}
                placeholder={placeholder}
                value={value}
                required={!!required}
                disabled={disabled}
                maxLength={maxlength}
                readOnly={readonly}
                title={title}
                spellCheck={spellCheck}
                autoComplete="off"
            />
        </div>
    );
};

InputWithIcon.propTypes = {
    label: PropTypes.string,
    classes: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    icon: PropTypes.string,
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
};

InputWithIcon.defaultProps = {
    label: '',
    classes: undefined,
    name: undefined,
    icon: 'fa fa-circle',
    type: 'text',
    placeholder: '',
    maxlength: '',
    changeEvent: () => {},
    required: false,
    disabled: false,
    readonly: false,
    title: '',
    spellCheck: false,
};

export default InputWithIcon;
