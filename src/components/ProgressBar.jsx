import React from 'react'
import PropTypes from 'prop-types';

const Progress = ({
    bgProgress, value, progressText
}) => {
    return (
        <div className="progress ">
            <div
                className={`progress-bar ${bgProgress}`}
                role="progressbar"
                style={{ width: `${value}%` }}
            >
                <span>
                    {`${value}% - ${progressText}`}
                </span>
            </div>
        </div>
    )
}

Progress.propTypes = {
    bgProgress: PropTypes.string,
    value: PropTypes.string,
    progressText: PropTypes.string,
};

Progress.defaultProps = {
    bgProgress: 'bg-info',
    value: '50',
    progressText: 'Complete'
};

export default Progress;
                  