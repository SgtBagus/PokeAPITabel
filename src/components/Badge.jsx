

import React from 'react'
import PropTypes from 'prop-types';

const Badge = ({
    className, label, children,
}) => {
    return (
        <span className={className}>
            {label}
            {children && (children)}
        </span>
    )
}

Badge.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    children: PropTypes.node,
};

Badge.defaultProps = {
    className: 'badge bg-primary',
    label: 'Badge',
    children: null,
};

export default Badge
