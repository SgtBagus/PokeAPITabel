import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import { NotificationManager } from 'react-notifications';
import { deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';

import { db } from '../../../firebase';

import TodoForm from './TodoForm';
import Tabel from '../../../Components/Tabel';

import { TABEL_META } from './config';

import { FORM_TYPES } from '../../../Enum/Form';
import { catchError } from '../../../Helper/helper';
import Swal from 'sweetalert2';

const TabelTodoList = ({
    title, data, mainId,
}) => {
    const [onSend, setOnSend] = useState(false);
    const { id: mainDoctId } = useParams();

    const updateStatus = async (id, val) => {
        setOnSend(true);

        try {
            await updateDoc(doc(db, "toDoTaskLists", mainDoctId), {
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

    const deleteData = async (id, title) => {
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
                
                setTimeout(() => { window.location.reload() }, 3000);
            }
        });
    } 

    return (
        <div className="row">
            <div className="col-12">
                <Tabel
                    title={title}
                    dataMeta={{
                        tabelHead: TABEL_META(
                            onSend,
                            data.length,
                            (id, val) => updateStatus(id, val),
                            (id, title) => deleteData(id, title),
                        ),
                        coloumnData: data,
                    }}
                />
            </div>
            <div className="col-12">
                <TodoForm
                    idModal="modal-create-todo"
                    buttonIcon="fas fa-plus fa-xs mr-2"
                    buttonLabel="Tambah Kegiatan"
                    btnSubmitText="Tambah"
                    typeModal="primary"
                    className="btn-block"
                    headerTitle="Tambah Kegiatan"
                    type={FORM_TYPES.CREATE}
                    mainId={mainId}
                    dataLength={data.length}
                />
            </div>
        </div>
    );
};

export default TabelTodoList;
