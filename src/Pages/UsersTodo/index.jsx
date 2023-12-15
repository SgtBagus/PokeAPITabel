import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import { collection, getDocs, query } from "firebase/firestore";

import { db } from "../../firebase";

import { LoadingContext } from "../../context/LoadingContext";
import { ButtonContext } from "../../context/ButtonContext";

import Tabel from "../../components/Tabel";

import { TABEL_META } from "./config";

import { catchError } from "../../Helper/helper";

const UsersTodo = () => {
    const { dispatch } = useContext(ButtonContext);
    const { dispatchLoading } = useContext(LoadingContext);

    const navigate = useNavigate();

    useEffect(() => {
        dispatch({
            typeSwtich: "CHANGE_BUTTON",
            dataButtonList: [
                {
                    buttonText: 'Tambah Todo',
                    iconButton: 'fa fa-plus',
                    onClick: () => { navigate('create') },
                },
            ]
        });

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
            <div className="col-12">
                <Tabel
                    title="User Todo List"
                    dataMeta={{
                        tabelHead: TABEL_META,
                        coloumnData: [],
                    }}
                    actionButton={{
                        view: { enabled: false },
                        edit: {
                            enabled: true,
                            onClick: ({id}) => {
                                console.log(id);
                            },
                        },
                        delete: {
                            enabled: true,
                            onClick: (data) => {
                                console.log(data);
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
}

export default UsersTodo;
