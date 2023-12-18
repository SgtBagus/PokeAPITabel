import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import { collection, getDocs, query } from "firebase/firestore";

import { db } from "../../../../firebase";

import { LoadingContext } from "../../../../Context/LoadingContext";
import { ButtonContext } from "../../../../Context/ButtonContext";

import Tabel from "../../../../Components/Tabel";

import { TABEL_META } from "./config";

import { catchError } from "../../../../Helper/helper";

const Todo = () => {
    const { dispatch } = useContext(ButtonContext);
    const { dispatchLoading } = useContext(LoadingContext);

    const navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            try {
                const res = query(collection(db, "toDoLists"));
                const data = await getDocs(res);
                
                const getDataTable = data.docs.map((x) => (x.data()));

                console.log(getDataTable);
            } catch (err) {
                NotificationManager.error(catchError(err), 'Terjadi Kesalahan', 5000);
            } finally {
                dispatchLoading(false);
            }
        };
        
        getData();
    }, [dispatch, dispatchLoading, navigate]);

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="info-box bg-primary">
                    <span className="info-box-icon">
                        <i className="fa fa-tasks"></i>
                    </span>
                    <div className="info-box-content">
                        <span className="info-box-text">
                            Judul Tugas nya
                            <br className="m-0"/>
                            <small>Task nya disini</small>
                        </span>
                        <span className="info-box-number">Jumlah Tasknya nanti disini - 70%</span>
                        <div className="progress">
                            <div className="progress-bar" style={{ width: '50%' }}></div>
                        </div>
                        <span className="progress-description">
                            Progress Note nya disini
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Todo;
