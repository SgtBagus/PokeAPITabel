import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { deleteDoc, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

import { db } from '../../../firebase';

import TodoForm from './TodoForm';
import Tabel from '../../../Components/Tabel';

import { TABEL_META } from './config';

import { FORM_TYPES } from '../../../Enum/Form';
import { catchError } from '../../../Helper/helper';

import Swal from 'sweetalert2';
import Button from '../../../Components/Button';
import Progress from '../../../Components/ProgressBar';

const TabelTodoList = ({
    title, data, mainId,
}) => {
    const [dataList, setDataList] = useState({ idEdit: false, data });
    const [onSend, setOnSend] = useState(false);

    const { isEdit, data: currentDataList } = dataList;


    useEffect(() => {
        setDataList({ isEdit: false, data })
    }, [data]);

    const dataReset = () => {
        setDataList({ isEdit: false, data })
    }

    const updateStatus = async (id, val) => {
        setOnSend(true);

        try {
            await updateDoc(doc(db, "toDoTaskLists", mainId), {
                [id + ".statusFinish"]: val,
                [id + ".updatedDate"]: serverTimestamp(),
                [id + ".finishDate"]: val ? serverTimestamp() : null,
            });
            
            setOnSend(false);
            NotificationManager.success('Berhasil Merubah Data', "Success !", 5000);
        } catch (err) {

            setOnSend(false);
            NotificationManager.error(catchError(err), "Terjadi Kesalahan", 5000);   
        }
    };

    const deleteTask = (selectedId) =>{
        const newDataList = currentDataList.filter(({ id }) => ( id !== selectedId));

        setDataList({ isEdit: true, data: newDataList })
    }

    const saveEditHandel = async () => {
        setOnSend(true);
    
        try {
            const dataList = currentDataList.reduce((x, data) => ({...x, [data.id]: data}), {})

            await setDoc( doc(db, "toDoTaskLists", mainId), dataList);
                
            setOnSend(false);
            NotificationManager.success('Berhasil Merubah Data', "Success !", 5000);
        } catch (err) {

            setOnSend(false);
            NotificationManager.error(catchError(err), "Terjadi Kesalahan", 5000);   
        }
    }

    const deleteData = async (id) => {
        Swal.fire({
            title: "Apakah anda yakin akan menghapus Data ini",
            text: `Kegiatan - ${title}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Iya, Hapus data ini!",
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                try {
                    await deleteDoc(doc(db, "toDoTaskLists", id));
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
            }
        });
    } 

    const getPercentage = (data = []) => {
        const totalValue = data.length;
        const totalFinish = data.filter(x => x.statusFinish).length
    
        return ((totalFinish/totalValue) * 100.0) || 0;
    }

    return (
        <>
            <div className="form-group">
                <label>Progress Persent</label>
                <Progress
                    value={parseFloat(getPercentage(currentDataList)).toFixed(0)}
                    progressText="Selesai"
                />
            </div>
            <div className="form-group">
                <Tabel
                    title={title}
                    dataMeta={{
                        tabelHead: TABEL_META(
                            onSend,
                            data.length,
                            mainId,
                            (id, val) => updateStatus(id, val),
                            (id) => deleteTask(id),
                        ),
                        coloumnData: currentDataList,
                    }}
                />
            </div>
            {
                isEdit && (
                    <>
                        <hr />
                        <div className="form-group">
                            <div className="row">
                                <div className="col-8">
                                    <Button
                                        label= {
                                            onSend ? "Memperoses" : "Simpan Semua Perubahan Kegiatan !"
                                        }
                                        className="btn btn-block btn-danger rounded"
                                        buttonIcon={
                                            onSend ? "fas fa-sync-alt fa-spin" : "fa fa-edit"
                                        }
                                        onClick={() => saveEditHandel()}
                                        disabled={onSend}
                                    />
                                </div>
                                <div className="col-4">
                                    <Button
                                        label= "Reset Data"
                                        className="btn btn-block btn-info rounded"
                                        buttonIcon="fa fa-sync-alt"
                                        onClick={() => dataReset()}
                                        disabled={onSend}
                                    />
                                </div>
                            </div>
                        </div>
                        <hr />
                    </>
                )
            }
            <div className="form-group">
                <div className="row">
                    <div className="col-6">
                        <TodoForm
                            idModal="modal-create-todo"
                            buttonIcon="fas fa-plus fa-xs mr-2"
                            buttonLabel="Tambah Kegiatan"
                            btnSubmitText="Tambah"
                            typeModal="primary"
                            className="w-100"
                            headerTitle="Tambah Kegiatan"
                            type={FORM_TYPES.CREATE}
                            mainId={mainId}
                            dataLength={currentDataList.length}
                        />
                    </div>
                    <div className="col-6">
                        <Button
                            label= { onSend ? "Memperoses" : "Hapus Semua Kegiatan" }
                            className="btn btn-danger rounded w-100"
                            buttonIcon={ onSend ? "fas fa-sync-alt fa-spin" : "fa fa-trash" }
                            onClick={() => deleteData(mainId)}
                            disabled={onSend}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default TabelTodoList;
