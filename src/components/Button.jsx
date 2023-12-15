import React from 'react'
import PropTypes from 'prop-types';

const ButonComponents = ({
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

ButonComponents.propTypes = {
    label: PropTypes.string,
    buttonIcon: PropTypes.string,
    className: PropTypes.string,
    type: PropTypes.string,

    disabled: PropTypes.bool,

    style: PropTypes.shape({}),
    
    onClick: PropTypes.func,
};

ButonComponents.defaultProps = {
    label: 'Button',
    buttonIcon: null,
    className: 'btn btn-primary',
    type: 'button',
    
    disabled: false,

    style: null,

    onClick: () => {},
};

export default ButonComponents
