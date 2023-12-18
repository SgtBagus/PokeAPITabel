import React from 'react'
import PropTypes from 'prop-types';

const Ribbon = ({
    title, bgStyle,
}) => {
    return (
        <div className="ribbon-wrapper ribbon-lg">
            <div className={`ribbon ${bgStyle} text-lg`}>
                {title}
            </div>
        </div>
    )
}

Ribbon.propTypes = {
    title: PropTypes.string,
    bgStyle: PropTypes.string,
};

Ribbon.defaultProps = {
    title: 'Ribbon',
    bgStyle: 'bg-primary',
};

export default Ribbon;
