import React from 'react'
import PropTypes from 'prop-types';

const Card = ({
    children, title, type, height,
}) => {
    return (
        <div className={`card ${type}`}>
            <div className="card-header">
                <h3 className="card-title">
                    {title}
                </h3>
            </div>
              <div
                className="card-body p-3"
                style={height && {
                    height,
                    overflow: 'auto',
                }}
            >
                {children}
            </div>
        </div>
    )
}

Card.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
    type: PropTypes.string,
    height: PropTypes.string,
};

Card.defaultProps = {
    children: null,
    title: 'Card',
    type: '',
    height: null,
};

export default Card;
