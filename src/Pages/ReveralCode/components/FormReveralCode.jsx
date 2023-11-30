import React, { Component } from "react";
import update from "immutability-helper";
import { v4 as uuid } from "uuid";
import { FieldFeedback, FieldFeedbacks } from 'react-form-with-constraints';
import { collection, query, getDocs } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { NotificationManager } from 'react-notifications';

import Modals from "../../../components/Modals";
import FormValidation from "../../../components/FormValidation";
import ButonComponents from "../../../components/Button";

import InputText from "../../../components/form/InputText";
import InputPercent from "../../../components/form/InputPercent";

import { db } from "../../../firebase";

import InputTextArea from "../../../components/form/InputTextArea";
import InputSelect from "../../../components/form/InputSelect";
import InputSwitch from "../../../components/form/InputSwitch";

import { catchError } from "../../../Helper/helper";
import { GENERATE_ERROR_MESSAGE } from "../../../Helper/error";

class FormReveralCode extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            form: {
                codeReveal: '',
                desc: '',
                discount: '',
                userId: '',
                status: false,
            },
            userList: [],
            loading: true,
            onSend: false,
            isFormSubmitted: false,
        };
    }

    componentDidMount = () => {
        this.fetchUserData();
    }
    
    fetchUserData = async () => {
        try {
            const data = await query(collection(db, "users"));
            const userData = await getDocs(data);
            const userList = userData.docs.map(doc => ({
                value: doc.data().uid,
                option: doc.data().displayName,
            }));
            
            this.setState({
                userList,
                loading: false,
            })
        } catch (err) {

        }
    }

    _onInputChangeValidate = ({ target }) => {
        this.form.validateInput(target);
    };

    generateString = (key, length) => {
        const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        let result = '';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        if (key) {
            this._changeInputHandler(key, result, null)
        }

        return result;
    }

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

    submitHandel = async () => {
        const isFormValid = await this.form.validateForm();

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

    resetForm = () => {
        this.setState({
            form: {
                codeReveal: '',
                desc: '',
                discount: '',
                userId: '',
                status: false,
            },
        })
    }

    handleSubmit = async () => {
        const { 
            form: {
                codeReveal, desc, discount, userId, status,
            },
        } = this.state;
        const { dataLogin: { uid } } = this.props;

        const combinedId = `${uid}${this.generateString(null, 5)}${uuid()}`;

        try {
            await setDoc(doc(db, "reveralCode", combinedId), {
                code: codeReveal,
                desc,
                discValue: discount,
                statusValue: status,
                userId,
                id: combinedId,
            });

            NotificationManager.success('Data Telah Terseimpan!, halaman ini akan segera di refresh', 'Success', 5000);
            setTimeout(() => { window.location.reload() }, 3000);
        } catch (err) {
            NotificationManager.warning(catchError(err), 'Terjadi Kesalahan', 5000);
        } finally {
            this.setState({
                onSend: false,
            })
        }
    }

    render() {
        const { 
            form: {
                codeReveal, desc, discount, userId, status,
            },
            userList, onSend,
        } = this.state;

        return (
            <Modals
                buttonIcon="fas fa-plus mx-2"
                buttonLabel="Tambah Reveal Code Baru"
                typeModal="primary"
                btnSubmitHandel={() => { this.submitHandel(); }}
                btnCancelHandel={() => { this.resetForm(); }}
                btnSubmitText={!onSend ? "Simpan" : "Menyimpan"}
                buttonSubmitIcon={ onSend ? "fas fa-sync-alt fa-spin mx-2" : ""}
                btnSubmitDisabled={onSend}
                modalLarge={true}
            >
                <div className="row">
                    <div className="col-md-12 my-2">
                        <h3>
                            <i className="fas fa-plus mx-2" />
                            Tambah Reveal Code
                        </h3>
                        <hr />
                        <FormValidation ref={(c) => { this.form = c; }}>
                            <div className="d-flex flex-column mb-2">
                                <label className="control-label">
                                    Reveral Code
                                    {' '}
                                    <span className="text-red"> * </span>
                                </label>
                                <div className="row">
                                    <div className="col-md-9">
                                        <InputText
                                            placeholder="Revelal Code"
                                            name="codeReveal"
                                            value={codeReveal}
                                            changeEvent={(val, e) => this._changeInputHandler('codeReveal', val, e)}
                                            maxlength="10"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <ButonComponents
                                            type="button"
                                            buttonType='btn btn-primary btn-block'
                                            buttonAction={() => this.generateString('codeReveal', 10)}
                                            buttonText="Generate Code"
                                            buttonIcon="fas fa-random"
                                        />
                                    </div>
                                </div>
                                <FieldFeedbacks for="codeReveal">
                                    <FieldFeedback when="valueMissing">
                                        {GENERATE_ERROR_MESSAGE('Revelal Code', 'valueMissing')} 
                                    </FieldFeedback>
                                </FieldFeedbacks>
                            </div>
                            <div className="d-flex flex-column mb-2">
                                <label className="control-label">
                                    Deskripsi
                                </label>
                                <InputTextArea
                                    value={desc}
                                    changeEvent={(val, e) => this._changeInputHandler('desc', val, e)}
                                    row="5"
                                />
                            </div>
                            <div className="d-flex flex-column mb-2">
                                <div className="row">
                                    <div className="col-md-4">
                                        <label className="control-label">
                                            Diskon (%)
                                            {' '}
                                            <span className="text-red"> * </span>
                                        </label>
                                        <InputPercent
                                            value={discount}
                                            changeEvent={(val, e) => this._changeInputHandler('discount', val, e)}
                                            name="discount"
                                            desimal
                                            maxDecimalPlaceLen={2}
                                            required
                                        />
                                        <FieldFeedbacks for="discount">
                                            <FieldFeedback when="valueMissing">
                                                {GENERATE_ERROR_MESSAGE('Diskon', 'valueMissing')} 
                                            </FieldFeedback>
                                        </FieldFeedbacks>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="control-label">
                                            Status Reveal Code
                                            {' '}
                                            <span className="text-red"> * </span>
                                            <InputSwitch
                                                label="Status Revak Code Aktif"
                                                value={status}
                                                changeEvent={(val, e) => this._changeInputHandler('status', val, e)}
                                            />
                                        </label>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="control-label">
                                            Penguna Code
                                            {' '}
                                            <span className="text-red"> * </span>
                                        </label>
                                        <InputSelect
                                            data={userList}
                                            value={userId}
                                            changeEvent={(val, e) => this._changeInputHandler('userId', val, e)}
                                            placeholder="Pilih Pengguna"
                                            name="userSelected"
                                            required
                                        />
                                        <FieldFeedbacks for="userSelected">
                                            <FieldFeedback when="valueMissing">
                                                {GENERATE_ERROR_MESSAGE('Penguna Code', 'valueMissing')} 
                                            </FieldFeedback>
                                        </FieldFeedbacks>
                                    </div>
                                </div>
                            </div>
                        </FormValidation>
                    </div>
                </div>
            </Modals>
        );
    }
};

export default FormReveralCode;
