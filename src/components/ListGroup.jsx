


import React from 'react'
import PropTypes from 'prop-types';

const ListGroup = ({
    data,
}) => {
    return (
        <ul className="list-group">
            {
                data.map((x, idx) => (
                    <li className="list-group-item" key={idx}>
                        {x}
                    </li>
                ))
            }
        </ul>
    )
}

ListGroup.propTypes = {
    data: PropTypes.array,
};

ListGroup.defaultProps = {
    data: [],
};

export default ListGroup
