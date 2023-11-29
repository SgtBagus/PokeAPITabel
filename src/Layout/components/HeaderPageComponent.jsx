import React, { useContext } from 'react';

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
                                        id, type, className, onClick, buttonText, iconButton, customButton,
                                    }) => (
                                        <div key={id} className='mx-2'>
                                            {
                                                customButton ? customButton
                                                : (
                                                    <button
                                                        type={type}
                                                        className={className}
                                                        onClick={onClick}
                                                    >
                                                        <i className={`${iconButton} mr-2`} />
                                                        {buttonText}
                                                    </button>
                                                )
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}