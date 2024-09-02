import React, { useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import { LoadingContext } from './LoadingContext';

export const withHocks = (Component) => {
    return (props) => {
        const { isLoading, dispatchLoading } = useContext(LoadingContext);

        return (
            <Component
                {...props}
                params={useParams()}
                navigate={useNavigate()}
                loadingParam={{ isLoading, dispatchLoading }}
            />
        )
    };
}
