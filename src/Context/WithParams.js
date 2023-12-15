import React, { useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import { AuthContext } from "./AuthContext";
import { LoadingContext } from './LoadingContext';

export const withHocks = (Component) => {
    return (props) => {
        const { currentUser } = useContext(AuthContext);
        const { isLoading, dispatchLoading } = useContext(LoadingContext);

        return (
            <Component
                {...props}
                params={useParams()}
                navigate={useNavigate()}
                dataLogin={currentUser}
                loadingParam={{ isLoading, dispatchLoading }}
            />
        )
    };
}
