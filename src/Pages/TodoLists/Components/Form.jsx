import React, { Component } from "react";
import update from "immutability-helper";
import { FieldFeedback, FieldFeedbacks } from "react-form-with-constraints";
import { NotificationManager } from "react-notifications";
import { deleteDoc, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

import { db } from "../../../firebase";

import { withHocks } from '../../../Context/WithParams';

import TabelTodoList from "./TabelTodoList";

import Card from '../../../Components/Card';
import FormValidation from "../../../Components/FormValidation";
import InputText from "../../../Components/form/InputText";
import InputTextArea from "../../../Components/form/InputTextArea";
import InputSelect from "../../../Components/form/InputSelect";
import Button from "../../../Components/Button";
import Progress from "../../../Components/ProgressBar";
import Loading from "../../../Components/Loading";
import InputToggle from "../../../Components/form/InputToggle";

import { GENERATE_ERROR_MESSAGE } from "../../../Helper/error";
import { GenerateString, catchError } from '../../../Helper/helper';
import fireBaseTime from '../../../Helper/fireBaseTime';

import { FORM_TYPES } from "../../../Enum/Form";

import { STATUS_LIST } from "./config";
import Swal from "sweetalert2";

class Form extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            form: {
                id: null,
                title: '',
                task: '',
                note: '',
                progressNote: '',
                isActive: false,
                statusFinish: false,
                finishDate: null,
                createdDate: null,
                updatedDate: null,
            },
            taskListId: null,
            dataDetails: [],
            isFormSubmitted: false,
            onSend: false,
            isLoading: true,
        };
    }

    componentDidMount = () => {
        const { loadingParam: { dispatchLoading }, params: { type } } = this.props;

        dispatchLoading(true);

        if (type === FORM_TYPES.EDIT) {
            this.getData();
        } else {
            this.setState({
                isLoading: false,
            }, () => {
                dispatchLoading(false);
            })
        }
    }

    getData = async () => {
        const { params: { id } } = this.props;

        try {
            onSnapshot(doc(db, "toDoLists", id), (doc) => {
                const {
                    id, isActive, updatedDate, task, note, finishDate, progressNote, createdDate, title, statusFinish,
                    taskListId,
                } = doc.data();
          
                this.setState({
                    form: {
                        id, title, task, note, progressNote, statusFinish, finishDate, createdDate, updatedDate, isActive,
                    },
                    taskListId,
                }, () => {
                    this.getDetailTask(taskListId);
                })
            });
        } catch (error) {
            NotificationManager.error(catchError(error), 'Terjadi Kesalahan', 5000);
        }
    }

    getDetailTask = async (taskListId) => {
        try {
            onSnapshot(doc(db, "toDoTaskLists", taskListId), (doc) => {
                let getData = [];

                Object.entries(doc.data().data).forEach(x => {
                    console.log(x[1]);
                    const data = Object.entries(x[1]).map(x => (x[1]));

                    return getData.push(data[0]);
                });
                const dataDetails = getData.sort((a, b) => a.orderNumber - b.orderNumber);

                this.setState({
                    dataDetails,
                    isLoading: false,
                })
            });
        } catch (error) {
            this.setState({
                isLoading: false,
            }, () => {
                NotificationManager.error(catchError(error), 'Terjadi Kesalahan', 5000);
            })
        }
    } 

    _onInputChangeValidate = ({ target }) => {
        this.mainForm.validateInput(target);
    };

    _changeInputHandler = async (type, val, e) => {
        const { form, isFormSubmitted } = this.state;

        if (isFormSubmitted) {
            const onInputChangeValidate = this._onInputChangeValidate(e);
            await onInputChangeValidate;
        }

        const newForm = update(form, {
            [type]: { $set: val },
        });

        this.setState({
            form: newForm,
        });
    };

    changeStatus = (val) => {
        const { form, dataDetails } = this.state;

        try {
            if (val && dataDetails.length === 0) {
                throw new Error ('Belum ada List Kegiatan yang di isi !')
            } else {
                const newForm = update(form, {
                    'isActive': { $set: val },
                });
    
                this.setState({
                    form: newForm,
                });
            }
        } catch (err) {
            NotificationManager.error(catchError(err), "Terjadi Kesalahan", 5000);
        }
    }

    redirectLink = (link) => {
        const { navigate } = this.props;

        return navigate(link);
    }

    getPercentage = (data = []) => {
        const totalValue = data.length;
        const totalFinish = data.filter(x => x.statusFinish).length
    
        return ((totalFinish/totalValue) * 100.0) || 0;
    }


    submitHandel = async () => {
        const isFormValid = await this.mainForm.validateForm();

        if (isFormValid) {
            this.setState({
                onSend: true,
            }, async () => {
                await this.handleSubmit();
            })
        }
    
        this.setState({
          isFormSubmitted: true,
        });
    }

    handleSubmit = () => {
        const { params: { type } } = this.props;

        if (type === FORM_TYPES.EDIT) {
            this.editHandel();
        } else {
            this.createHandel();
        }
    }

    createHandel = async () => {
        const {
            form: {
                title, task, note, progressNote, statusFinish,
            },
        } = this.state;
        const { params: { uid }, navigate } = this.props;

        try {
            const combinedId = `${uid}${GenerateString(10)}`;
            const taskListId = `${combinedId}${GenerateString(10)}`;

            await setDoc(doc(db, "toDoLists", combinedId), {
                id: combinedId,
                uid,
                taskListId,
                title,
                task,
                note,
                progressNote,
                statusFinish,
                finishDate: null,
                isActive: false,
                createdDate: serverTimestamp(),
                updatedDate: serverTimestamp(),
            });
            
            this.setState({
                onSend: false,
            }, () => {
                NotificationManager.success('Data Telah Tersimpan!', 'Success', 5000);

                setTimeout(() => {
                    return navigate(`/client/to-do/edit/${uid}/${combinedId}`);
                }, 3000);
            });
        } catch (err) {
            this.setState({
                onSend: false,
            }, () => {
                NotificationManager.error(catchError(err), "Terjadi Kesalahan", 5000);
            });
        }
    }

    editHandel = async () => {
        const {
            form: {
                id, title, task, note, isActive, statusFinish,
            },
        } = this.state;

        try {
            await updateDoc(doc(db, 'toDoLists', id), {
                title,
                task,
                note,
                isActive,
                statusFinish,
                finishDate: statusFinish ? serverTimestamp() : null,
                createdDate: serverTimestamp(),
                updatedDate: serverTimestamp(),
            });
            
            this.setState({
                onSend: false,
            }, () => {
                NotificationManager.success('Data Telah Tersimpan!', 'Success', 5000);
            });
        } catch (err) {
            this.setState({
                onSend: false,
            }, () => {
                NotificationManager.error(catchError(err), "Terjadi Kesalahan", 5000);
            });
        }
    }

    confirmDeleteHandel = (id, title) => {
        Swal.fire({
            title: "Apakah anda yakin akan menghapus Data ini",
            text: `Code Reveral Code - ${title}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Iya, Hapus data ini!",
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                try {
                    await deleteDoc(doc(db, "toDoLists", id));
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

    render() {
        const {
            form: {
                id, title, task, note, progressNote, statusFinish, finishDate, createdDate, updatedDate,
                isActive,
            },
            onSend, dataDetails, isLoading, taskListId,
        } = this.state;
        const { params: { type } } = this.props;

        return (
            <Card
                title="Todo Kegiatan"
                icon="fa fa-tasks"
                type="card-primary"
            >
                {
                    isLoading ? (
                        <div className="overlay position-relative" style={{ height: "400px" }}>
                            <Loading />
                        </div>
                    ) : (
                        <FormValidation ref={(c) => { this.mainForm = c; }}>
                            <div
                                className="p-1 m-1"
                                style={{
                                    maxHeight: '70vh', overflowY: 'auto', overflowX: 'hidden',
                                }}
                            >
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Judul Kegiatan</label>
                                            <InputText
                                                placeholder="Judul Kegiatan"
                                                name="title"
                                                value={title}
                                                changeEvent={(val, e) => this._changeInputHandler('title', val, e)}
                                                required
                                            />
                                            <FieldFeedbacks for="title">
                                                <FieldFeedback when="valueMissing">
                                                    {GENERATE_ERROR_MESSAGE('Title', 'valueMissing')}
                                                </FieldFeedback>
                                            </FieldFeedbacks>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Kegiatan</label>
                                            <InputText
                                                placeholder="Kegiatan"
                                                name="task"
                                                value={task}
                                                changeEvent={(val, e) => this._changeInputHandler('task', val, e)}
                                                required
                                            />
                                            <FieldFeedbacks for="task">
                                                <FieldFeedback when="valueMissing">
                                                    {GENERATE_ERROR_MESSAGE('Task', 'valueMissing')}
                                                </FieldFeedback>
                                            </FieldFeedbacks>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label>Status Kegiatan</label>
                                            <InputToggle
                                                value={isActive}
                                                disabled={type === FORM_TYPES.CREATE}
                                                changeEvent={(val, e) => this.changeStatus(val, e)}
                                                label={isActive ? (
                                                    <code>Aktif</code>
                                                ) : (
                                                    <code>Tidak Aktif</code>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Catatan</label>  
                                    <InputTextArea                                        
                                        value={note}
                                        changeEvent={(val, e) => this._changeInputHandler('note', val, e)}
                                        row="5"
                                        name="note"
                                        placeholder="Catatan"
                                        required
                                    />
                                    <FieldFeedbacks for="note">
                                        <FieldFeedback when="valueMissing">
                                            {GENERATE_ERROR_MESSAGE('Catatan', 'valueMissing')}
                                        </FieldFeedback>
                                    </FieldFeedbacks>
                                </div>
                                {
                                    type === FORM_TYPES.EDIT && (
                                        <>
                                            <div className="form-group">
                                                <label>Progress Persent</label>
                                                <Progress
                                                    value={parseFloat(this.getPercentage(dataDetails)).toFixed(0)}
                                                    progressText="Selesai"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <TabelTodoList title="Kegiatan List" mainId={taskListId} data={dataDetails} />
                                            </div>
                                            <div className="form-group">
                                                <label>
                                                    Progress Kegiatan
                                                    <code> Input ini di isi dengan Client !</code>
                                                </label>
                                                <InputTextArea                                        
                                                    value={progressNote}
                                                    name="progressNote"
                                                    placeholder="Progress Kegiatan"
                                                    row="4"
                                                    disabled
                                                />
                                            </div>
                                        </>
                                    )
                                }
                                <div className="form-group">
                                    <label>Status Kegiatan</label>
                                    <InputSelect
                                        data={STATUS_LIST}
                                        value={statusFinish}
                                        placeholder="Status kegiatan"
                                        changeEvent={(val, e) => this._changeInputHandler('statusFinish', val, e)}
                                        name="status"
                                        required
                                    />
                                    <FieldFeedbacks for="status">
                                        <FieldFeedback when="valueMissing">
                                            {GENERATE_ERROR_MESSAGE('Status Kegiatan', 'valueMissing')} 
                                        </FieldFeedback>
                                    </FieldFeedbacks>
                                </div>
                                {
                                    type === FORM_TYPES.EDIT && (
                                        <>
                                            <hr />
                                            {
                                                statusFinish ? (
                                                    <div className="form-group">
                                                        <label>Di Selesaikan Pada</label>
                                                        <InputText
                                                            name="finishDate"
                                                            value={
                                                                `${fireBaseTime(finishDate).toDateString().toString("MMMM yyyy")} - ${fireBaseTime(finishDate).toLocaleTimeString()}`
                                                            }
                                                            disabled
                                                        />
                                                    </div>
                                                ) : (
                                                    <></>
                                                )
                                            }

                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label>Di Buat Pada</label>
                                                        <InputText
                                                            name="createdDate"
                                                            value={
                                                                `${fireBaseTime(createdDate).toDateString().toString("MMMM yyyy")} - ${fireBaseTime(createdDate).toLocaleTimeString()}`
                                                            }
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label>Di Ubah Pada</label>
                                                        <InputText
                                                            name="updatedDate"
                                                            value={
                                                                `${fireBaseTime(updatedDate).toDateString().toString("MMMM yyyy")} - ${fireBaseTime(updatedDate).toLocaleTimeString()}`
                                                            }
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                            <div className="form-group float-right">
                                <Button
                                    className="btn btn-default"
                                    label="Kembali !"
                                    buttonIcon="fas fa-arrow-left"
                                    onClick={() => { this.redirectLink('/client') }}
                                />
                                <Button
                                    label={onSend ? "Memperoses !" : 'Simpan'}
                                    className="btn btn-primary mx-2"
                                    buttonIcon={ onSend ? "fas fa-sync-alt fa-spin" : "fa fa-save" }
                                    onClick={() => { this.submitHandel(); }}
                                    disabled={onSend}
                                />
                                {
                                    type === FORM_TYPES.EDIT && (
                                        <Button
                                            label={onSend ? "Memperoses !" : 'Hapus'}
                                            className="btn btn-danger"
                                            buttonIcon={ onSend ? "fas fa-sync-alt fa-spin" : "fa fa-trash" }
                                            onClick={() => { this.confirmDeleteHandel(id, title); }}
                                            disabled={onSend}
                                        />
                                    )
                                }
                            </div>
                        </FormValidation>
                    )
                }
            </Card>
        );
    };
}

export default withHocks(Form);
