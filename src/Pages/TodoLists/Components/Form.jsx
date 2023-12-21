import React, { Component } from "react";
import update from "immutability-helper";
import { FieldFeedback, FieldFeedbacks } from "react-form-with-constraints";
import { NotificationManager } from "react-notifications";
import { doc, onSnapshot } from "firebase/firestore";

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

import { GENERATE_ERROR_MESSAGE } from "../../../Helper/error";
import { catchError } from '../../../Helper/helper';
import fireBaseTime from '../../../Helper/fireBaseTime';

import { STATUS_LIST } from "./config";

class Form extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            form: {
                title: '',
                task: '',
                note: '',
                progressNote: '',
                status: true,
                finishDate: null,
                createdDate: null,
                updatedDate: null,
            },
            dataDetails: [],
            isFormSubmitted: false,
            onSend: false,
            isLoading: true,
        };
    }

    componentDidMount = () => {
        const { loadingParam: { dispatchLoading } } = this.props;

        dispatchLoading(true);
        this.getData();
    }

    getData = async () => {
        const { params: { id: selectedId }, mainTask } = this.props;

        await onSnapshot(doc(db, "toDoLists", mainTask), (doc) => {
            const dataToArray = Object.entries(doc.data()).map(x => x[1]).find(({ id }) => (id === selectedId ));
            const {
                id, updatedDate, task, note, finishDate, progressNote, createdDate, title, statusFinish,
            } = dataToArray;

            this.setState({
                form: {
                    title, task, note, progressNote, status: statusFinish, finishDate, createdDate, updatedDate,
                }
            }, () => {
                this.getDetailTask(id);
            })
        }, (error) => {
            NotificationManager.error(catchError(error), 'Terjadi Kesalahan', 5000);
        });
    }

    getDetailTask = async (id) => {
        await onSnapshot(doc(db, "toDoTaskLists", id), (doc) => {
            const res = Object.entries(doc.data()).map(x => x[1]);
            const dataDetails = res.sort((a, b) => a.orderNumber - b.orderNumber);

            this.setState({
                dataDetails,
                isLoading: false,
            })
        }, (error) => {
            NotificationManager.error(catchError(error), 'Terjadi Kesalahan', 5000);
        });
    } 

    _onInputChangeValidate = ({ target }) => {
        this.form.validateInput(target);
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

    redirectLink = (link) => {
        const { navigate } = this.props;

        return navigate(link);
    }

    getPercentage = (data = []) => {
        const totalValue = data.length;
        const totalFinish = data.filter(x => x.statusFinish).length
    
        return ((totalFinish/totalValue) * 100.0) || 0;
    }

    render() {
        const {
            form: {
                title, task, note, progressNote, status, finishDate, createdDate, updatedDate,
            },
            onSend, dataDetails, isLoading, 
        } = this.state;

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
                        <FormValidation ref={(c) => { this.form = c; }}>
                            <div
                                className="p-1 m-1"
                                style={{
                                    height: '70vh', overflowY: 'auto', overflowX: 'hidden',
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
                                    <div className="col-md-8">
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
                                <div className="form-group">
                                    <label>Progress Persent</label>
                                    <Progress
                                        value={parseFloat(this.getPercentage(dataDetails)).toFixed(0)}
                                        progressText="Selesai"
                                    />
                                </div>
                                <div className="form-group">
                                    <TabelTodoList title="Kegiatan List" data={dataDetails} />
                                </div>
                                <div className="form-group">
                                    <label>Progress Kegiatan</label>
                                    <InputTextArea                                        
                                        value={progressNote}
                                        name="progressNote"
                                        placeholder="Progress Kegiatan"
                                        row="4"
                                        disabled
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Status Kegiatan</label>
                                    <InputSelect
                                        data={STATUS_LIST}
                                        value={status}
                                        placeholder="Status kegiatan"
                                        changeEvent={(val, e) => this._changeInputHandler('status', val, e)}
                                        name="status"
                                        required
                                    />
                                    <FieldFeedbacks for="status">
                                        <FieldFeedback when="valueMissing">
                                            {GENERATE_ERROR_MESSAGE('Status Kegiatan', 'valueMissing')} 
                                        </FieldFeedback>
                                    </FieldFeedbacks>
                                </div>
                                <hr />
                                {
                                    status && (
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
                            </div>
                            <div className="form-group float-right">
                                <Button
                                    className="btn btn-default mr-2"
                                    label="Kembali !"
                                    buttonIcon="fas fa-arrow-left"
                                    onClick={() => { this.redirectLink('/client') }}
                                />
                                <Button
                                    label={onSend ? "Memperoses !" : 'Simpan'}
                                    className="btn btn-primary"
                                    buttonIcon={ onSend ? "fas fa-sync-alt fa-spin" : "fa fa-save" }
                                    onClick={() => {}}
                                    disabled={onSend}
                                />
                            </div>
                        </FormValidation>
                    )
                }
            </Card>
        );
    };
}

export default withHocks(Form);
