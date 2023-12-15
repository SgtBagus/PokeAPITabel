import React, { useContext } from 'react';

import ButonComponents from '../../components/Button';

import { ButtonContext } from "../../context/ButtonContext";

export const HeaderPageComponent = ({
    pageName,
}) => {
    const { dataButtonList } = useContext(ButtonContext);
    return (
        <div className="content-header">
            <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-4">
                        <h1 className="m-0">{pageName}</h1>
                    </div>
                    {
                        dataButtonList && (
                            <div className="col-sm-8 d-flex justify-content-end">
                                {
                                    dataButtonList.map(({
                                        type, className, disabled, style, onClick, buttonText, iconButton,
                                        customButton,
                                    }, idx) => {
                                        return (
                                            <div key={idx} className='mx-2'>
                                                {
                                                    customButton ? customButton
                                                    : (
                                                        <ButonComponents
                                                            label={buttonText}
                                                            buttonIcon={iconButton}
                                                            className={className}
                                                            type={type}
                                                            disabled={disabled}
                                                            style={style}
                                                            onClick={onClick}
                                                        />
                                                    )
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}