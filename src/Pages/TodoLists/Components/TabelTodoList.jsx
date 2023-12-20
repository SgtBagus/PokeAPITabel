import React from 'react';

import TodoForm from './TodoForm';
import Tabel from '../../../Components/Tabel';

import { TABEL_META } from './config';

import { FORM_TYPES } from '../../../Enum/Form';

const TabelTodoList = ({
    title, data,
}) => {
    return (
        <div className="row">
            <div className="col-12">
                <Tabel
                    title={title}
                    dataMeta={{
                        tabelHead: TABEL_META,
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
