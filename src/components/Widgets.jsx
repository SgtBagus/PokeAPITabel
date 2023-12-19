import React from 'react'
import PropTypes from 'prop-types';

import Button from './Button';
import Ribbon from './Ribbon';

const renderRibbon = (ribbon) => {
    const { title, bgStyle } = ribbon;

    return (    
        <Ribbon title={title} bgStyle={bgStyle} />
    )
}

const renderButton = (ribbon) => {
    const { label, className, buttonIcon, onHandel } = ribbon;

    return (    
        <Button
            label={label}
            className={className}
            buttonIcon={buttonIcon}
            onClick={onHandel}
        />
    )
}

const Widgets = ({
    borderClass, icon, title, subTitle, descWidgets, ribbonStyle, buttonStyle,
    children, iconClass,
}) => {
    return (
        <div className={`info-box border ${borderClass}`}>
            <span className="info-box-icon align-items-baseline">
                <div className={`${iconClass} p-3 rounded-lg`}>
                    <i className={icon} />
                </div>
            </span>
            <div className="info-box-content">
                <h2 className="info-box-text">{title}</h2>
                {
                    subTitle && (
                        <small>{subTitle}</small>
                    )
                }
                <span className="progress-description">
                    {
                        descWidgets.length > 150
                        ? <>{descWidgets.substring(0, 150)}.....</>
                        : descWidgets
                    }
                </span>
                { children && (
                    <div className='border-top mt-2 py-3'>
                        {children}
                    </div>
                )}
                { ribbonStyle && ( renderRibbon(ribbonStyle)) }
                { buttonStyle && ( renderButton(buttonStyle)) }
            </div>
        </div>
    )
}

Widgets.propTypes = {
    borderClass: PropTypes.string,
    iconClass: PropTypes.string,
    icon: PropTypes.string,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    descWidgets: PropTypes.string,
    ribbonStyle: PropTypes.shape({
        title: PropTypes.string,
        bgStyle: PropTypes.string,
    }),
    buttonStyle: PropTypes.shape({
        label: PropTypes.string,
        className: PropTypes.string,
        buttonIcon: PropTypes.string,
        onHandel: PropTypes.func.isRequired,
    }),
    children: PropTypes.node,
};

Widgets.defaultProps = {
    borderClass: 'border-primary',
    iconClass: 'border-primary',
    icon: 'fa fa-user',
    title: 'Title Widgets',
    subTitle: null,
    descWidgets: 'descWidgets',
    ribbonStyle: null,
    buttonStyle: null,
    children: null,
};

export default Widgets;
