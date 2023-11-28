

import React from 'react'
import PropTypes from 'prop-types';

const Badge = ({
    className, label,
}) => {
    return (
        <span className={className}>{label}</span>
    )
}

Badge.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
};

Badge.defaultProps = {
    className: 'badge bg-primary',
    label: '',
};

export default Badge
