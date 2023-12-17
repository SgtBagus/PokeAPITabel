import React, { Component } from 'react';
import update from "immutability-helper";
import { FieldFeedback, FieldFeedbacks } from 'react-form-with-constraints';
import { NotificationManager } from 'react-notifications';
import {
    collection, query, getDocs, where, doc, updateDoc,
} from "firebase/firestore";

import FormValidation from '../../../components/FormValidation';
import Card from '../../../components/Card';

import InputText from '../../../components/form/InputText';
import InputTextArea from '../../../components/form/InputTextArea';
import InputPercent from '../../../components/form/InputPercent';
import InputSwitch from '../../../components/form/InputSwitch';
import InputSelect from '../../../components/form/InputSelect';
import ButtonComponents from '../../../components/Button';
import Loading from '../../../components/Loading';

import { db } from "../../../firebase";

import { catchError } from "../../../Helper/helper";
import { GENERATE_ERROR_MESSAGE } from '../../../Helper/error';
import { withHocks } from '../../../context/WithParams';

class EditFormReveralCode extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            form: {
                id: '',
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
        const { params: { id } } = this.props;

        this.setState({
            loading: true,
        }, async () => {
            await this.fetchUserData();
            await this.getData(id);
        })
    }

    fetchUserData = async () => {
        try {
            const data = await query(collection(db, "users"));
            const userData = await getDocs(data);
            const userList = userData.docs.map(doc => ({
                value: doc.data().uid,
                option: doc.data().displayName,
            }));
            
            this.setState({ userList})
        } catch (err) {
            NotificationManager.warning(catchError(err), 'Terjadi Kesalahan', 5000);
        }
    }
    
    getData = async (idParam) => {
        try {
            const data = await query(collection(db, "reveralCode"), where("id", "==", idParam));
            const userData = await getDocs(data);
            const {
                code, desc, discValue, statusValue, userId, id,
            } = userData.docs.map(doc => doc.data())[0];

            this.setState({
                form: {
                    id,
                    codeReveal: code,
                    desc,
                    discount: discValue,
                    userId: userId,
                    status: statusValue,
                },
                loading: false,
            })
        } catch (err) {
            NotificationManager.warning(catchError(err), 'Terjadi Kesalahan', 5000);
        }
    }

    _onInputChangeValidate = ({ target }) => {
        this.form.validateInput(target);
    };

    generateString = async (key, length) => {
        const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        let result = '';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        this._changeInputHandler(key, result, null)
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

    handelNavigate = (path) => {
        const { navigate } = this.props;
        
        navigate(path);
    }

    submitHandel = async () => {
        const isFormValid = await this.form.validateForm();

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

    handleSubmit = async () => {
        const { 
            form: {
                id, codeReveal, desc, discount, userId, status,
            },
        } = this.state;

        try {
            await updateDoc(doc(db, 'reveralCode', id), {
                code: codeReveal,
                desc,
                discValue: discount,
                statusValue: status,
                userId,
            });
            
            this.setState({ onSend: false }, () => {
                NotificationManager.success('Berhasil Mengubah Data', 'Berhasil', 5000);
            });
        } catch(err) {
            NotificationManager.error(catchError(err), 'Terjadi Kesalahan', 5000);
        }
    }

    render() {
        const { 
            form: {
                codeReveal, desc, discount, userId, status,
            },
            userList, onSend, loading,
        } = this.state;

        return (
            <Card
                title="Edit Reveal Code"
                type="card-primary"
            >
                {
                    loading ? (
                        <div className="container h-100">
                            <div className="d-flex flex-column align-items-center justify-content-center h-100">
                                <Loading title="Memuat..." />
                            </div>
                        </div>
                    )
                    : (
                        <div className="row">
                            <div className="col-md-12 my-2">
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
                                                <ButtonComponents
                                                    label="Generate Code"
                                                    className="btn btn-primary btn-block"
                                                    buttonIcon="fas fa-random"
                                                    onClick={() => this.generateString('codeReveal', 10)}
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
                                    <hr />
                                    <div className="row">
                                        <div className="col-12">
                                            <div className='d-flex justify-content-end'>
                                                <ButtonComponents
                                                    label="Kembali"
                                                    className="btn btn-default mx-2"
                                                    onClick={() => this.handelNavigate('reveral-code')}
                                                />
                                                <ButtonComponents
                                                    label={onSend ? 'Memperoses' : 'Simpan'}
                                                    buttonIcon={onSend ? 'fas fa-sync-alt fa-spin' : 'fas fa-save'}
                                                    className="btn btn-primary mx-2"
                                                    onClick={() => { this.submitHandel(); }}
                                                    disabled={onSend}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </FormValidation>
                            </div>
                        </div>
                    )
                }
            </Card>
        );
    }
};

export default withHocks(EditFormReveralCode);
