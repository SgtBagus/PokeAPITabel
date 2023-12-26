import React, { Component } from 'react';
import { FieldFeedback, FieldFeedbacks } from "react-form-with-constraints";
import update from "immutability-helper";
import { doc, updateDoc, setDoc, Timestamp } from 'firebase/firestore';
import { NotificationManager } from 'react-notifications';

import { db } from '../../../firebase';

import { withHocks } from '../../../Context/WithParams';

import { uploadFile } from '../../../Data/uploadFile';

import FormValidation from '../../../Components/FormValidation';
import Modals from '../../../Components/Modals';
import InputText from '../../../Components/form/InputText';
import InputWithIcon from '../../../Components/form/InputWithIcon';
import InputSelect from '../../../Components/form/InputSelect';
import InputTextArea from '../../../Components/form/InputTextArea';
import InputFile from '../../../Components/form/InputFile';

import fireBaseTime from '../../../Helper/fireBaseTime';
import { GENERATE_ERROR_MESSAGE } from '../../../Helper/error';
import { checkThisFileIsImageOrNot } from '../../../Helper/checkFile';
import { GenerateString, catchError } from '../../../Helper/helper';

import { STATUS_LIST } from './config';
import { FORM_TYPES } from '../../../Enum/Form';

class TodoForm extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            form: {
                id: '',
                title: '',
                icon: 'fas fa-solid fa-circle',
                attact: null,
                note: '',
                orderNumber: '',
                task: '',
                statusFinish: false,
                createdDate: null,
                finishDate: null,
                updatedDate: null,
            },
            currentImage: null,
            isFormSubmitted: false,
            onSend: false,
            isLoading: true,
        };
    }

    componentDidMount = () => {
        const { data } = this.props;

        const {
            id, title, icon, attact, note,
            orderNumber, task, statusFinish, 
            createdDate, finishDate, updatedDate,
        } = data || {
            id: '', title: '', icon: 'fas fa-solid fa-circle',
            attact: null, note: '', orderNumber: '',
            task: '', statusFinish: false,
            createdDate: null, finishDate: null, updatedDate: null,
        }

        this.setState({
            form: {
                id, title, icon, attact,
                note, orderNumber, task, statusFinish,
                createdDate, finishDate, updatedDate,
            },
            currentImage: data ? attact : null,
        })
    }
    
    _onInputChangeValidate = ({ target }) => {
        this.formDetail.validateInput(target);
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

    submitHandel = async () => {
        const isFormValid = await this.formDetail.validateForm();

        if (isFormValid) {
            this.setState({
                loading: true,
            }, async () => {
                this.setState({
                    onSend: true,
                }, async () => {
                    await this.handleSubmit();
                })
            });
        }
    
        this.setState({
          isFormSubmitted: true,
        });
    }

    handleSubmit = () => {
        const { type } = this.props;

        if (type === FORM_TYPES.EDIT) {
            this.handelEdit();
        } else {
            this.handelCreate();
        }
    }

    handelCreate = async () => {
        const { 
            form: { title, icon, task, orderNumber, statusFinish, note, attact }
        } = this.state;

        try {
            if (attact) {
                const uploadImage = await this.uploadImage(attact);

                await this.createDocs(uploadImage, icon, note, orderNumber, statusFinish, task, title);
            } else {
                await this.createDocs(null, icon, note, orderNumber, statusFinish, task, title);
            }
            
            this.setState({
                onSend: false,
            }, () => {
                document.getElementById(`btnCancelModalsTodo-${FORM_TYPES.CREATE}`).click();

                NotificationManager.success('Berhasil Merubah Data', "Success !", 5000);
            });
        } catch (err) {
            this.setState({
                onSend: false,
            }, () => {
                NotificationManager.error(catchError(err), "Terjadi Kesalahan", 5000);

                document.getElementById(`btnCancelModalsTodo-${FORM_TYPES.CREATE}`).click();
            });
        }
    }
    
    handelEdit = async () => {
        const {
            form: {
                id, title, icon, task, orderNumber, statusFinish,
                note, attact,
            }, currentImage,
        } = this.state;

        try {
            if (attact && ( attact !== currentImage)) {
                const uploadImage = await this.uploadImage(attact);

                await this.updateDocHandel(id, uploadImage, icon, note, orderNumber, statusFinish, task, title);
            } else {
                await this.updateDocHandel(id, null, icon, note, orderNumber, statusFinish, task, title);
            }

            this.setState({
                onSend: false,
            }, () => {
                NotificationManager.success('Berhasil Merubah Data', "Success !", 5000);

                document.getElementById(`btnCancelModalsTodo-${id}`).click();
            });
        } catch (err) {
            this.setState({
                onSend: false,
            }, () => {
                NotificationManager.error(catchError(err), "Terjadi Kesalahan", 5000);

                document.getElementById(`btnCancelModalsTodo-${id}`).click();
            });
        }
    }

    uploadImage = async (val) => {
        const thisFileisImage = checkThisFileIsImageOrNot(val);
        const uploadImage = await uploadFile(val, thisFileisImage ? "to-do/images/" : "to-do/videos" );

        return uploadImage;
    }

    createDocs = async (
        attact, icon, note, orderNumber, statusFinish, task, title,
    ) => {
        const { mainId, dataLength} = this.props;

        const combineId = `${mainId}${GenerateString(5)}`;

        try {
            if (dataLength !== 0) {
                await updateDoc(doc(db, "toDoTaskLists", mainId), {
                    [combineId]: {
                        id: combineId,
                        attact,
                        icon,
                        note,
                        orderNumber,
                        statusFinish,
                        task,
                        title,
                        finishDate: statusFinish ? Timestamp.now() : null,
                        createdDate: Timestamp.now(),
                        updatedDate: Timestamp.now(),
                    },
                });
            } else {
                await setDoc(doc(db, "toDoTaskLists", mainId), {
                    [combineId]: {
                        id: combineId,
                        attact,
                        icon,
                        note,
                        orderNumber,
                        statusFinish,
                        task,
                        title,
                        finishDate: statusFinish ? Timestamp.now() : null,
                        createdDate: Timestamp.now(),
                        updatedDate: Timestamp.now(),
                    },
                });
            }

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

    updateDocHandel = async (
        id, attact, icon, note, orderNumber, statusFinish, task, title,
    ) => {
        const { mainId } = this.props;

        await updateDoc(doc(db, "toDoTaskLists", mainId), {
            [id]: {
                id,
                attact,
                icon,
                note,
                orderNumber,
                statusFinish,
                task,
                title,
                finishDate: statusFinish ? Timestamp.now() : null,
                createdDate: Timestamp.now(),
                updatedDate: Timestamp.now(),
            },
        });
    }

    setImage = (val) => {
        const { form } = this.state;

        const newForm = update(form, {
            'attact': { $set: val },
        });

        this.setState({
            form: newForm,
        });
    }

    render() {
        const {
            form: {
                id, title, icon, task, orderNumber, statusFinish,
                note, attact,
                createdDate, finishDate, updatedDate,
            }, onSend,
        } = this.state;
        const {
            idModal, buttonIcon, btnSubmitText, typeModal, buttonLabel, className,
            headerTitle, type,
        } = this.props;

        return (
                <Modals
                    idModal={idModal}
                    buttonIcon={buttonIcon}
                    typeModal={typeModal}
                    className={className}
                    buttonLabel={buttonLabel}
                    headerTitle={headerTitle}
                    btnSubmitHandel={() => { this.submitHandel(); }}
                    btnSubmitText={onSend ? "Memperoses" : btnSubmitText}
                    buttonSubmitIcon={onSend ? "fas fa-sync-alt fa-spin mr-2" : "fa fa-save mr-2"}
                    btnSubmitDisabled={onSend}
                    btnCancelId={`btnCancelModalsTodo-${type === FORM_TYPES.EDIT ? id : FORM_TYPES.CREATE}`}
                    modalLarge
                >
                    <FormValidation ref={(c) => { this.formDetail = c; }}>
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
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Catatan</label>
                                    <InputTextArea                                  
                                        value={note}
                                        changeEvent={(val, e) => this._changeInputHandler('note', val, e)}
                                        row="10"
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
                            </div>
                            <div className="col-md-6">
                                <label>File</label>
                                <InputFile                           
                                    value={attact}
                                    placeHolder="Pilih File"
                                    changeEvent={(val) => this.setImage(val)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label>Urutan Tugas</label>
                                    <InputText
                                        type="number"
                                        placeholder="Urutan Tugas"
                                        name="sortingTask"
                                        value={orderNumber}
                                        changeEvent={(val, e) => this._changeInputHandler('orderNumber', val, e)}
                                        required
                                    />
                                    <FieldFeedbacks for="sortingTask">
                                        <FieldFeedback when="valueMissing">
                                            {GENERATE_ERROR_MESSAGE('Urutan Tugas', 'valueMissing')}
                                        </FieldFeedback>
                                    </FieldFeedbacks>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label>
                                        Icon
                                        <small className='ml-1'>
                                            <a href="https://remixicon.com/" target='_blank' rel="noreferrer">
                                                Custom Icon untuk refensi
                                            </a>
                                        </small>
                                    </label>
                                    <InputWithIcon
                                        icon={icon}
                                        placeholder="Icon"
                                        name="icon"
                                        value={icon}
                                        changeEvent={(val, e) => this._changeInputHandler('icon', val, e)}
                                        required
                                    />
                                    <FieldFeedbacks for="icon">
                                        <FieldFeedback when="valueMissing">
                                            {GENERATE_ERROR_MESSAGE('Icon', 'valueMissing')}
                                        </FieldFeedback>
                                    </FieldFeedbacks>
                                </div>
                            </div>
                            <div className="col-md-4">
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
                            </div>
                        </div>
                        {
                            type === FORM_TYPES.EDIT && (
                                <>
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
                    </FormValidation>
                </Modals>
        );
    };
};

export default withHocks(TodoForm);
