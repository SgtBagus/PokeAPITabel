import React from 'react'
import PropTypes from 'prop-types';

const Card = ({
    children, title, type, height, icon, style
}) => {
    return (
        <div className={`card ${type}`} style={style}>
            {
                title && (
                    <div className="card-header">
                        <h3 className="card-title d-flex align-items-center">
                            {
                                icon && (<i className={`${icon} mr-2`} />)
                            }
                            {title}
                        </h3>
                    </div>
                )
            }
            <div
                className="card-body p-2"
                style={height && { height, overflow: 'auto' }}
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
    icon: PropTypes.string,
    style: PropTypes.shape(),
};

Card.defaultProps = {
    children: null,
    title: null,
    type: '',
    height: null,
    icon: null,
    style: null,
};

export default Card;
