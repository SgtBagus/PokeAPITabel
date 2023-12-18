import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

import { LoadingContext } from "../../Context/LoadingContext";

const TodoLists = () => {
    const { dispatchLoading } = useContext(LoadingContext);

    useEffect(() => {
        dispatchLoading(false);
    });

    console.log(useParams());

    return (
        <div className="row">
            test
        </div>
    );
}

export default TodoLists;
