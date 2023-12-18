import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

import { LoadingContext } from "../../Context/LoadingContext";

import Card from '../../Components/Card';

const TodoLists = () => {
    const { dispatchLoading } = useContext(LoadingContext);

    useEffect(() => {
        dispatchLoading(false);
    });

    console.log(useParams());

    return (
        <Card title="To Do Client">
            <div className="row">
                <div className="col-md-12">
                    sdsd
                </div>
            </div>
        </Card>
    );
}

export default TodoLists;
