import React from 'react'
import PropTypes from 'prop-types';

const Button = ({
    className, label, onClick,
    style, disabled, type,
    buttonIcon, props,
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
                    <i
                        className={`
                            ${buttonIcon}
                            ${label !== '' ? 'mr-2' : ''}
                        `}
                    />
                )
            }
            {label}
        </button>
    )
}

Button.propTypes = {
    label: PropTypes.string,
    buttonIcon: PropTypes.string,
    className: PropTypes.string,
    type: PropTypes.string,

    disabled: PropTypes.bool,

    style: PropTypes.shape({}),
    
    onClick: PropTypes.func,
};

Button.defaultProps = {
    label: '',
    buttonIcon: null,
    className: 'btn btn-primary',
    type: 'button',
    
    disabled: false,

    style: null,

    onClick: () => {},
};

export default Button
