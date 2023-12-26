import TodoForm from "./TodoForm";

import Badge from "../../../Components/Badge";
import Button from "../../../Components/Button";

import { FORM_TYPES } from '../../../Enum/Form';
import fireBaseTime from "../../../Helper/fireBaseTime";

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

export const TABEL_META = (
    onSend,
    dataLength,
    mainId,
    ChangeStatus,
) => [
    {
        title: 'No',
        key: 'orderNumber',
        Cell: (val) => (
            <h5 className="text-center">{val}</h5>
        )
    },
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
        AllData: true,
        Cell: (val) => {
            const { id, statusFinish } = val;

            return (
                <div className="d-flex align-items-center justify-content-between">
                    {statusFinish ? <Badge className="badge bg-primary" label="Selesai" /> : <Badge className="badge bg-danger" label="Belum Selesai" />}

                    <Button
                        label= {
                            onSend ? "Memperoses" : "Ubah Status"
                        }
                        className="btn btn-warning btn-sm mx-2 rounded"
                        buttonIcon={
                            onSend ? "fas fa-sync-alt fa-spin" : "fa fa-edit"
                        }
                        onClick={() => ChangeStatus(id, !statusFinish)}
                        disabled={onSend}
                    />
                </div>
            )
        }
    },
    {
        title: 'Dibuat Pada',
        key: 'createdDate',
        Cell: (val) => (
            onSend ? ( <i className="fas fa-sync-alt fa-spin"/> ) : `${fireBaseTime(val).toDateString().toString("MMMM yyyy")}`
        )
    },
    {
        title: 'Di update Pada',
        key: 'updatedDate',
        Cell: (val) => (
            onSend ? ( <i className="fas fa-sync-alt fa-spin"/> ) : `${fireBaseTime(val).toDateString().toString("MMMM yyyy")}`
        )
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
                        buttonIcon="fas fa-edit fa-xs mr-2"
                        btnSubmitText="Simpan"
                        buttonLabel="Edit"
                        typeModal="info"
                        type={FORM_TYPES.EDIT}
                        dataLength={dataLength}
                        mainId={mainId}
                        className="btn-sm mx-2 rounded"
                        headerTitle={(
                            <>
                                <i className={`${icon} mr-2`} />
                                Detail Kegiatan - {title}
                            </>
                        )}
                    />
                </div>
            )
        }
    },
];
