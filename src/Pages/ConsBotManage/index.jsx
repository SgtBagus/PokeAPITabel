import React, { useState, useEffect, useContext } from 'react';
import { query } from 'firebase/database';
import { useNavigate } from "react-router-dom";
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { NotificationManager } from 'react-notifications';
import Swal from 'sweetalert2';

import { db } from "../../firebase";

import Tabel from '../../Components/Tabel';
import Loading from '../../Components/Loading';
import InputText from '../../Components/form/InputText';
import Card from '../../Components/Card';

import { LoadingContext } from '../../Context/LoadingContext';

import { ButtonContext } from "../../Context/ButtonContext";

import { FORM_TYPES } from '../../Enum/Form';
import { catchError } from '../../Helper/helper';
import { TABEL_META } from './config';


const ConsBotManage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [dataMeta, setDataMeta] = useState({ tabelHead: TABEL_META, coloumnData: [] });

    const { dispatchLoading } = useContext(LoadingContext);
    const { dispatch } = useContext(ButtonContext);

    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);

        dispatch({
            typeSwtich: "CHANGE_BUTTON",
            dataButtonList: [
                {
                    type: 'button',
                    className: 'btn btn-primary',
                    buttonText: 'Create New Argum Key',
                    onClick: () => { navigate(FORM_TYPES.CREATE) },
                },
            ]
        });

        const getData = async () => {
            try {
                const res = query(collection(db, "chatBotDatas"));
                const data = await getDocs(res);
                
                const getDataTable = data.docs.map((x) => (x.data()));

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
    }, [dispatch, dispatchLoading, navigate]);

    const confirmDeleteHandel = (data) => {
        const { intent, id } = data;

        Swal.fire({
            title: "Apakah anda yakin akan menghapus Data ini",
            text: `Cons Bot Management - ${intent}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Iya, Hapus data ini!",
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                try {
                    await deleteDoc(doc(db, "chatBotDatas", id));
                } catch (error) {
                    Swal.showValidationMessage(`Request failed: ${error}`);
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
          }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Success",
                    text: "Berhasil Menghapus data, halaman ini akan di mulai ulang",
                    icon: "success"
                });

                setTimeout(() => { window.location.reload() }, 3000);
            }
        });
    }

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
                                            value="Corpus"
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
                                            value="1.0"
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
                                            value="en-US"
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
                                            navigate(`${FORM_TYPES.EDIT}/${id}`)
                                        },
                                    },
                                    delete: {
                                        enabled: true,
                                        onClick: (data) => {
                                            confirmDeleteHandel(data);
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
