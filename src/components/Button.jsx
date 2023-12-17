import React from 'react'
import PropTypes from 'prop-types';

const ButtonComponents = ({
    className, label, onClick,
    style, disabled, type,
    buttonIcon,
}) => {
    return (
        <button
            type={type}
            className={className}
            onClick={onClick}
            style={style && (style)}
            disabled={disabled}
        >
            {
                buttonIcon && (
                    <i className={`${buttonIcon} mr-2`}></i>
                )
            }
            {label}
        </button>
    )
}

ButtonComponents.propTypes = {
    label: PropTypes.string,
    buttonIcon: PropTypes.string,
    className: PropTypes.string,
    type: PropTypes.string,

    disabled: PropTypes.bool,

    style: PropTypes.shape({}),
    
    onClick: PropTypes.func,
};

ButtonComponents.defaultProps = {
    label: 'Button',
    buttonIcon: null,
    className: 'btn btn-primary',
    type: 'button',
    
    disabled: false,

    style: null,

    onClick: () => {},
};

export default ButtonComponents
