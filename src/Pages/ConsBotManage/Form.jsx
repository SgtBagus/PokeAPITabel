import React, { Component } from "react";
import { NotificationManager } from "react-notifications";
import { collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { FieldFeedback, FieldFeedbacks } from "react-form-with-constraints";
import update from "immutability-helper";
import { v4 as uuid } from "uuid";
import Swal from 'sweetalert2';

import { db } from "../../firebase";

import { withHocks } from "../../Context/WithParams";

import FormValidation from "../../Components/FormValidation";

import Card from "../../Components/Card";
import Loading from "../../Components/Loading";
import Button from '../../Components/Button';

import InputText from "../../Components/form/InputText";
import InputTextArea from "../../Components/form/InputTextArea";

import { GENERATE_ERROR_MESSAGE } from "../../Helper/error";
import { catchError, GenerateString } from "../../Helper/helper";
import { FORM_TYPES } from "../../Enum/Form";

class ConsBotManageForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            form: {
                id: '',
                intent: '',
                utterances: [''],
                answers: [''],
            },
            isFormSubmitted: false,
            onSend: false,
            isLoading: true,
        };
    }

    componentDidMount = () => {
        const {
            loadingParam: { dispatchLoading }, params: { type }
        } = this.props;

        if (type === FORM_TYPES.EDIT) {
            this.getData();
        } else {
            this.setState({
                isLoading: false,
            }, () => {
                dispatchLoading(false);
            });
        }
    };

    getData = async () => {
        const {
            loadingParam: { dispatchLoading }, params: { id }
        } = this.props;

        const data = await query(collection(db, "chatBotDatas"), where("id", "==", id));
        const userData = await getDocs(data);
        const newForm = userData.docs.map(doc => doc.data())[0];

        this.setState({
            form: newForm,
            isLoading: false,
        }, () => {
            dispatchLoading(false);
        })
    }

    _onInputChangeValidate = ({ target }) => {
        this.form.validateInput(target);
    };

    _changeInputHandler = async (type, val, e) => {
        const { form, isFormSubmitted } = this.state;

        if (isFormSubmitted && e) {
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

    createNewArray = (type) => {
        const { form } = this.state;
        const { utterances, answers } = form;

        const newUtterances = [...utterances, ''];
        const newAnswers = [...answers, ''];

        let newForm = {};
        if (type === 'utterances') {
            newForm = update(form, {
                utterances: { $set: newUtterances },
            });
        } else {
            newForm = update(form, {
                answers: { $set: newAnswers },
            });
        }

        this.setState({
            form: newForm,
        });
    }

    deleteArray = (type, index) => {
        const { form } = this.state;
        const { utterances, answers } = form;
        
        const newUtterances = utterances.filter((x, idx) => idx !== index);
        const newAnswers = answers.filter((x, idx) => idx !== index);

        let newForm = {};
        if (type === 'utterances') {
            newForm = update(form, {
                utterances: { $set: newUtterances },
            });
        } else {
            newForm = update(form, {
                answers: { $set: newAnswers },
            });
        }

        this.setState({
            form: newForm,
        });
    }

    changeArray = async (type, value, index, e) => {
        const { form, isFormSubmitted } = this.state;
        const { utterances, answers } = form;

        if (isFormSubmitted && e) {
            const onInputChangeValidate = this._onInputChangeValidate(e);
            await onInputChangeValidate;
        }

        const newUtterances = utterances.map((x, idx) => idx === index ? value : x )
        const newAnswers = answers.map((x, idx) => idx === index ? value : x )

        let newForm = {};
        if (type === 'utterances') {
            newForm = update(form, {
                utterances: { $set: newUtterances },
            });
        } else {
            newForm = update(form, {
                answers: { $set: newAnswers },
            });
        }

        this.setState({
            form: newForm,
        });
    }

    confirmDeleteHandel = () => {
        const { navigate } = this.props;
        const { form: { id, intent } } = this.state;

        Swal.fire({
            title: "Apakah anda yakin akan menghapus Data ini",
            text: `Cons Bot Management - ${intent}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Iya, Hapus data ini!",
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                try {
                    await deleteDoc(doc(db, "chatBotDatas", id));
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
                
                setTimeout(() => {
                    navigate('/cons-bot-manage');
                }, 3000);
            }
        });
    }

    sumbitHandel = async () => {
        const isFormValid = await this.form.validateForm();

        if (isFormValid) {
            this.setState({
                loading: true,
                onSend: true,
            }, async () => {
                await this.handleSubmit();
            });
        }
    
        this.setState({
          isFormSubmitted: true,
        });
    }

    handleSubmit = async () => {
        const { params: { type } } = this.props;
        const { form } = this.state;
        const { id } = form;

        try {
            if (type === FORM_TYPES.EDIT) {
                await this.editDocs(form, id);
            } else {
                await this.createNewDocs(form);
            }
        } catch (err) {
            NotificationManager.warning(catchError(err), 'Terjadi Kesalahan', 5000);
        } finally {
            this.setState({
                onSend: false,
            })
        }
    }

    createNewDocs = async (form) => {
        const { navigate } = this.props;

        const combinedNewId = `${GenerateString(10)}${uuid()}`;

        try {
            await setDoc(doc(db, "chatBotDatas", combinedNewId), {
                id: combinedNewId,
                ...form
            });
            NotificationManager.success('Data Telah Tersimpan!, halaman ini akan segera di refresh', 'Success', 5000);

            setTimeout(() => {
                navigate('/cons-bot-manage');
            }, 3000);
        } catch (err) {
            NotificationManager.warning(catchError(err), 'Terjadi Kesalahan', 5000);
        }
    }

    editDocs = async (data, id) => {
        const { navigate } = this.props;

        try {
            await updateDoc(doc(db, 'chatBotDatas', id), data);

            NotificationManager.success('Data Telah Tersimpan!, halaman ini akan segera di refresh', 'Success', 5000);

            setTimeout(() => {
                navigate('/cons-bot-manage');
            }, 3000);
        } catch (err) {
            NotificationManager.warning(catchError(err), 'Terjadi Kesalahan', 5000);
        }
    }

    render() {
        const {
            form: { 
                intent, utterances, answers,
            }, onSend, isLoading,
        } = this.state;
        const { navigate } = this.props;

        return (
            <Card>
                <h5>Create New Argumt Key</h5>
                <hr />
                {
                    isLoading ? (
                        <div className="container h-100">
                            <div className="d-flex flex-column align-items-center justify-content-center h-100">
                                <Loading title="Memuat..." />
                            </div>
                        </div>
                    ) :(
                        <FormValidation ref={(c) => { this.form = c; }} >
                            <div className="d-flex flex-column mb-2">
                                <label className="control-label">
                                    Intent - (Maksud)
                                    {' '}
                                    <span className="text-red"> * </span>
                                </label>
                                <InputText
                                    placeholder="Intent - (Maksud)"
                                    name="intent"
                                    value={intent}
                                    changeEvent={(val, e) => this._changeInputHandler('intent', val, e)}
                                    required
                                />
                                <FieldFeedbacks for="intent">
                                    <FieldFeedback when="valueMissing">
                                        {GENERATE_ERROR_MESSAGE('Intent - (Maksud)', 'valueMissing')} 
                                    </FieldFeedback>
                                </FieldFeedbacks>
                            </div>
                            <div className="d-flex flex-column mb-2">
                                <label className="control-label">
                                    Utterances - (Ucapan)
                                    {' '}
                                    <span className="text-red"> * </span>
                                </label>
                                <div className="border rounded p-3">
                                    {
                                        utterances.map((x, idx) => {
                                            const no = idx + 1;
                                            return (
                                                <div className="d-flex" key={idx}>
                                                    <div className="mr-2">
                                                        <b>{no}</b>
                                                    </div>
                                                    <div className="flex-fill">
                                                        <InputTextArea
                                                            value={x}
                                                            changeEvent={(val, e) => { this.changeArray('utterances', val, idx, e) }}
                                                            row="3"
                                                            name={`utterances-${idx}`}
                                                            placeholder="Utterances"
                                                            required
                                                        />
                                                        <FieldFeedbacks for={`utterances-${idx}`}>
                                                            <FieldFeedback when="valueMissing">
                                                                {GENERATE_ERROR_MESSAGE(`Utterances - (Ucapan)-${no}`, 'valueMissing')} 
                                                            </FieldFeedback>
                                                        </FieldFeedbacks>
                                                    </div>
                                                    {
                                                        utterances.length !== 1 && (
                                                            <div>
                                                                <Button
                                                                    className="btn btn-danger rounded mx-2"
                                                                    buttonIcon="fa fa-trash"deleteArray
                                                                    onClick={() => { this.deleteArray('utterances', idx) }}
                                                                />
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                    
                                    <Button
                                        label="Tambah Utterances - (Ucapan)"
                                        className="btn btn-primary rounded w-100 mx-2"
                                        onClick={() => { this.createNewArray('utterances') }}
                                    />
                                </div>
                            </div>
                            <div className="d-flex flex-column mb-2">
                                <label className="control-label">
                                    Answers - (Jawaban)
                                    {' '}
                                    <span className="text-red"> * </span>
                                </label>
                                <div className="border rounded p-3">
                                    {
                                        answers.map((x, idx) => {
                                            const no = idx + 1;
        
                                            return (
                                                <div className="d-flex" key={idx}>
                                                    <div className="mr-2">
                                                        <b>{no}</b>
                                                    </div>
                                                    <div className="flex-fill">
                                                        <InputTextArea
                                                            value={x}
                                                            changeEvent={(val, e) => { this.changeArray('answers', val, idx, e) }}
                                                            row="3"
                                                            name={`answers-${idx}`}
                                                            placeholder="Answers"
                                                            required
                                                        />
                                                        <FieldFeedbacks for={`answers-${idx}`}>
                                                            <FieldFeedback when="valueMissing">
                                                                {GENERATE_ERROR_MESSAGE(`Answers - (Jawaban)-${no}`, 'valueMissing')} 
                                                            </FieldFeedback>
                                                        </FieldFeedbacks>
                                                    </div>
                                                    {
                                                        answers.length !== 1 && (
                                                            <div>
                                                                <Button
                                                                    className="btn btn-danger rounded mx-2"
                                                                    buttonIcon="fa fa-trash"
                                                                    onClick={() => { this.deleteArray('answers', idx) }}
                                                                />
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                    
                                    <Button
                                        label="Tambah Answers - (Jawaban)"
                                        className="btn btn-primary rounded w-100 mx-2"
                                        onClick={() => { this.createNewArray('answers') }}
                                    />
                                </div>
                            </div>
                            <div className="d-flex flex-column mb-2">
                                <div className="d-flex justify-content-end">
                                    <Button
                                        label="Back"
                                        className="btn btn-default rounded mx-2"
                                        buttonIcon="fa fa-arrow-left"
                                        onClick={() => navigate('/cons-bot-manage')}
                                    />
                                    <Button
                                        label={!onSend ? "Save" : "Progress"}
                                        className="btn btn-primary rounded mx-2"
                                        buttonIcon={onSend ? "fas fa-sync-alt fa-spin mx-2" : "fa fa-save mx-2"}
                                        onClick={() => this.sumbitHandel()}
                                        disabled={onSend}
                                    />
                                    <Button
                                        label={!onSend ? "Delete" : "Progress"}
                                        className="btn btn-danger rounded mx-2"
                                        buttonIcon={onSend ? "fas fa-sync-alt fa-spin mx-2" : "fa fa-trash mx-2"}
                                        onClick={() => this.confirmDeleteHandel()}
                                        disabled={onSend}
                                    />
                                </div>
                            </div>
                        </FormValidation>
                    )
                }
            </Card>
        );
    }
}

export default withHocks(ConsBotManageForm);
