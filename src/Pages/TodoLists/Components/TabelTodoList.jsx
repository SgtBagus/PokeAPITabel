import React from 'react';

import Tabel from '../../../Components/Tabel';
import Modals from '../../../Components/Modals';

import { TABEL_META } from './config';

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
                <Modals
                    buttonIcon="fas fa-plus mx-2"
                    buttonLabel="Tambah Kegiatan"
                    className="w-100"
                    btnSubmitHandel={() => {}}
                    btnCancelHandel={() => {}}
                    btnSubmitText="Simpan"
                    buttonSubmitIcon="fa fa-save mr-2"
                    typeModal="primary"
                    modalLarge
                >
                    <div className="row">
                        <div className="col-md-12 my-2">
                            asdsa
                        </div>
                    </div>
                </Modals>
            </div>
        </div>
    );
};

export default TabelTodoList;
