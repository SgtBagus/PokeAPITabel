import React, { useState, useEffect, useContext } from 'react';
import { collection, query, getDocs, deleteDoc, doc } from "firebase/firestore";
import { NotificationManager } from 'react-notifications';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import FormReveralCode from './components/FormReveralCode';

import Tabel from '../../components/Tabel';
import Loading from '../../components/Loading';

import { ButtonContext } from "../../context/ButtonContext";
import { AuthContext } from "../../context/AuthContext";
import { LoadingContext } from '../../context/LoadingContext';

import { db } from "../../firebase";
import { catchError } from '../../Helper/helper';

import { TABEL_META } from './config';

const ReveralCode = () => {
    const [dataMeta, setDataMeta] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const { dispatch } = useContext(ButtonContext);
    const { currentUser } = useContext(AuthContext);
    const { dispatchLoading } = useContext(LoadingContext);

    useEffect(() => {
        setIsLoading(true);
          
        dispatch({
            typeSwtich: "CHANGE_BUTTON",
            dataButtonList: [
                {
                    id: 1,
                    customButton: (
                        <FormReveralCode dataLogin={currentUser} />
                    )
                },
            ]
        });

        const getData = async () => {
            try {
                const res = query(collection(db, "reveralCode"));
                const data = await getDocs(res);
                
                const getDataTable = data.docs.map((x) => {
                    const { id, code, desc, discValue, statusValue, userId } = x.data();
                    return {
                        id, code, desc, discValue, statusValue, userId,
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
    
            dispatchLoading(false);
        };
        
        getData();
    }, [currentUser, dispatch, dispatchLoading]);

    const handelNavigate = (path) => {
        return navigate(path);
    }

    const confirmDeleteHandel = (data) => {
        const { code, id } = data;

        Swal.fire({
            title: "Apakah anda yakin akan menghapus Data ini",
            text: `Code Reveral Code - ${code}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Iya, Hapus data ini!",
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                try {
                    await deleteDoc(doc(db, "reveralCode", id));
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
                        <Tabel
                            title="Reveral Code"
                            dataMeta={dataMeta}
                            actionButton={{
                                view: { enabled: false },
                                edit: {
                                    enabled: true,
                                    onClick: ({id}) => {
                                        handelNavigate(id);
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
                    )
                }
            </div>
        </div>
    );
};

export default ReveralCode;
