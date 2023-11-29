import React, { useState, useEffect, useContext } from 'react';
import { collection, query, getDocs } from "firebase/firestore";
import { NotificationManager } from 'react-notifications';

import FormReveralCode from './components/FormReveralCode';

import Tabel from '../../components/Tabel';
import Loading from '../../components/Loading';

import { ButtonContext } from "../../context/ButtonContext";

import { db } from "../../firebase";
import { catchError } from '../../Helper/helper';

import { TABEL_META } from './config';

const ReveralCode = () => {
    const [dataMeta, setDataMeta] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { dispatch } = useContext(ButtonContext);

    useEffect(() => {
        setIsLoading(true);
        dispatch({
            typeSwtich: "CHANGE_BUTTON",
            dataButtonList: [
                {
                    id: 1,
                    customButton: (
                        <FormReveralCode />
                    )
                },
            ]
        });

        const getData = async () => {
            try {
                const res = query(collection(db, "reveralCode"));
                const data = await getDocs(res);
                
                const getDataTable = data.docs.map((x) => {
                    const { code, desc, discValue, statusValue, userId } = x.data();
                    return {
                        code, desc, discValue, statusValue, userId,
                    };
                });

                setDataMeta({
                    tabelHead: TABEL_META,
                    coloumnData: getDataTable,
                });

                setIsLoading(false);
              } catch (err) {
                NotificationManager.error(catchError(err), 'Terjadi Kesalahan', 5000);
            }
        };
        
        getData();
    }, [dispatch]);

    return (
        <div className="row">
            <div className="col-12">
                {
                    isLoading ? (
                        <div className="container h-100">
                            <div className="d-flex flex-column align-items-center justify-content-center h-100">
                                <Loading title="Memuat..." />
                            </div>
                        </div>
                    ) :(
                        <Tabel
                            title="Reveral Code"
                            dataMeta={dataMeta}
                            actionButton={{
                                view: { enabled: false },
                                edit: {
                                    enabled: true,
                                    onClick: (data) => {
                                        console.log(data);
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
                    )
                }
            </div>
        </div>
    );
};

export default ReveralCode;
