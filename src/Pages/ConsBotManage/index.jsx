import React, { useState, useEffect, useContext } from 'react';
import { query } from 'firebase/database';
import { collection, getDocs } from 'firebase/firestore';
import { NotificationManager } from 'react-notifications';

import { db } from "../../firebase";

import Tabel from '../../Components/Tabel';
import Loading from '../../Components/Loading';
import InputText from '../../Components/form/InputText';
import Card from '../../Components/Card';

import { LoadingContext } from '../../Context/LoadingContext';

import { catchError } from '../../Helper/helper';
import { TABEL_META } from './config';


const ConsBotManage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [settings, setSettings] = useState({ locale: '', name: '', version: '' })
    const [dataMeta, setDataMeta] = useState({ tabelHead: TABEL_META, coloumnData: [] });

    const { dispatchLoading } = useContext(LoadingContext);

    useEffect(() => {
        setIsLoading(true);

        const getData = async () => {
            try {
                const res = query(collection(db, "chatBotDatas"));
                const data = await getDocs(res);
                
                let getDataTable = [];
                data.docs.map((x) => {
                    const { locale, name, version, data } = x.data();

                    setSettings({ locale, name, version});

                    getDataTable = data;
                    return null;
                });

                setDataMeta({
                    tabelHead: TABEL_META,
                    coloumnData: getDataTable,
                });

                setIsLoading(false);
              } catch (err) {
                NotificationManager.error(catchError(err), 'Terjadi Kesalahan', 5000);
            }
    
            dispatchLoading(false);
        };
        
        getData();
    }, [dispatchLoading]);

    const { locale, name, version } = settings;
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
                        <Card>
                            <div className='row mb-3'>
                                <div className='col-md-4'>
                                    <div className="d-flex flex-column mb-2">
                                        <label className="control-label">
                                            Nama
                                        </label>
                                        <InputText
                                            value={name}
                                            changeEvent={() => {}}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="d-flex flex-column mb-2">
                                        <label className="control-label">
                                            Version
                                        </label>
                                        <InputText
                                            value={version}
                                            changeEvent={() => {}}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="d-flex flex-column mb-2">
                                        <label className="control-label">
                                            Locale
                                        </label>
                                        <InputText
                                            value={locale}
                                            changeEvent={() => {}}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                            <Tabel
                                title="Argum Key"
                                dataMeta={dataMeta}
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
                        </Card>
                    )
                }
            </div>
        </div>
    );
};

export default ConsBotManage;
