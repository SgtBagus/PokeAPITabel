import React, { useContext } from 'react';

import Button from '../../Components/Button';

import { ButtonContext } from "../../Context/ButtonContext";

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
                                                        <Button
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