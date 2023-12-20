import TodoForm from "./TodoForm";

import Badge from "../../../Components/Badge";

import { FORM_TYPES } from '../../../Enum/Form';

export const STATUS_LIST = [
    {
        value: true,
        option: 'Selesai',
    },
    {
        value: false,
        option: 'Belum Selesai',
    },
]

export const TABEL_META = [
    {
        title: 'Judul',
        key: 'title',
    },
    {
        title: 'Kegiatan',
        key: 'task',
    },
    {
        title: 'Status',
        key: 'statusFinish',
        Cell: (val) => {
            return val ? <Badge className="badge bg-primary" label="Selesai" /> : <Badge className="badge bg-danger" label="Belum Selesai" />
        }
    },
    {
        title: 'Urutan',
        key: 'orderNumber',
    },
    {
        title: 'Action',
        AllData: true,
        Cell: (val) => {
            const { id, icon, title } = val;

            return (
                <div className="btn-group">
                    <TodoForm
                        data={val}
                        idModal={`modal-${id}`}
                        buttonIcon="fas fa-edit fa-xs"
                        btnSubmitText="Simpan"
                        buttonLabel=""
                        typeModal="info"
                        type={FORM_TYPES.EDIT }
                        headerTitle={(
                            <>
                                <i className={`${icon} mr-2`} />
                                Detail Kegiatan - {title}
                            </>
                        )}
                    />
                    <button type="button" className="btn btn-danger" onClick={() => {}}>
                        <i className="fas fa-trash fa-xs" />
                    </button>
                </div>
            )
    }
    },
];
