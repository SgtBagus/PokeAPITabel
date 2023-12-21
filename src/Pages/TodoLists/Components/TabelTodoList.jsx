import React, { useState } from 'react';
import { useParams } from "react-router-dom";

import TodoForm from './TodoForm';
import Tabel from '../../../Components/Tabel';

import { TABEL_META } from './config';

import { FORM_TYPES } from '../../../Enum/Form';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { catchError } from '../../../Helper/helper';
import { NotificationManager } from 'react-notifications';

const TabelTodoList = ({
    title, data, mainTask,
}) => {
    const [onSend, setOnSend] = useState(false);
    const { id: mainDoctId } = useParams();

    const updateStatus = async (id, val) => {
        setOnSend(true);

        try {
            await updateDoc(doc(db, "toDoTaskLists", mainDoctId), {
                [id + ".statusFinish"]: val,
                [id + ".updatedDate"]: serverTimestamp(),
            });
            
            setOnSend(false);
            NotificationManager.success('Berhasil Merubah Data', "Success !", 5000);
        } catch (err) {

            setOnSend(false);
            NotificationManager.error(catchError(err), "Terjadi Kesalahan", 5000);   
        }
    };

    return (
        <div className="row">
            <div className="col-12">
                <Tabel
                    title={title}
                    dataMeta={{
                        tabelHead: TABEL_META(
                            onSend,
                            (id, val) => updateStatus(id, val),
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
                    type={FORM_TYPES.CREATE }
                />
            </div>
        </div>
    );
};

export default TabelTodoList;
