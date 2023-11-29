import React from 'react'
import PropTypes from 'prop-types';

const InputSwitch = ({
    label, id, value, changeEvent,
}) => {
    return (
        <div className="custom-control custom-switch">
            <input
                type="checkbox"
                checked={value}
                className="custom-control-input"
                id={id}
                value={value}
                onChange={(e) => { changeEvent(e.target.checked, e)}}
            />
            <label className="custom-control-label" htmlFor={id}>
                {label}
            </label>
        </div>
    )
}

InputSwitch.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.bool,
    changeEvent: PropTypes.func.isRequired,
};

InputSwitch.defaultProps = {
    id: 'Switch-1',
    label: 'Switcher',
    value: false,
};

export default InputSwitch
