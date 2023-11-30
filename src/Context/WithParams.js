import React, { useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import { AuthContext } from "./AuthContext";

export const withHocks = (Component) => {
    return (props) => {
        const { currentUser } = useContext(AuthContext);

        return (
            <Component
                {...props}
                params={useParams()}
                navigate={useNavigate()}
                dataLogin={currentUser} 
            />
        )
    };
}
