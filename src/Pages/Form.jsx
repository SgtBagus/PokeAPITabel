import React, { Component } from 'react';
import update from "immutability-helper";
import { FieldFeedback, FieldFeedbacks } from 'react-form-with-constraints';
import { NotificationManager } from 'react-notifications';

import FormValidation from '../Components/FormValidation';
import Card from '../Components/Card';

import InputText from '../Components/form/InputText';
import InputTextArea from '../Components/form/InputTextArea';
import InputPercent from '../Components/form/InputPercent';
import InputFile from '../Components/form/InputFile';
import Button from '../Components/Button';
import Loading from '../Components/Loading';

import { catchError } from "../Helper/helper";
import { GENERATE_ERROR_MESSAGE } from '../Helper/error';
import { withHocks } from '../Context/WithParams';

class EditForm extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            form: {
                id: '',
                name: '',
                desc: '',
                image: '',
                price: '',
                stock: '',
            },
            loading: true,
            onSend: false,
            isFormSubmitted: false,
        };
    }

    componentDidMount = () => {
        const { params: { id }, loadingParam: { dispatchLoading } } = this.props;
        if (id) {
            this.setState({
                loading: true,
            }, async () => {
                await this.getData(id);
            })
        } else {
            this.setState({
                loading: false,
            })
        }
        dispatchLoading(false);
    }

    getData = async (idParam) => {
        try {
            await fetch(`https://dummyjson.com/products/${idParam}`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                const { id, title, description, images, price, stock } = data;

                this.setState({
                    form: {
                        id,
                        name: title,
                        desc: description,
                        image: images[0],
                        price: price,
                        stock: stock,
                    },
                    loading: false,
                });
            });
        } catch (err) {
            this.setState({
                loading: false,
            }, () => {
                NotificationManager.warning(catchError(err), 'Terjadi Kesalahan', 5000);
            });
        }
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
        try {
            console.log('Nanti Payload nya Disini!');
        } catch(err) {
            NotificationManager.error(catchError(err), 'Terjadi Kesalahan', 5000);
        }
    }

    render() {
        const { 
            form: {
                name, desc, image, price, stock,
            },
            onSend, loading,
        } = this.state;

        return (
            <Card
                title="Edit Product"
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
                                            Title
                                            {' '}
                                            <span className="text-red"> * </span>
                                        </label>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <InputText
                                                    placeholder="Title"
                                                    value={name}
                                                    name="title"
                                                    changeEvent={(val, e) => this._changeInputHandler('name', val, e)}
                                                    maxlength="10"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <FieldFeedbacks for="title">
                                            <FieldFeedback when="valueMissing">
                                                {GENERATE_ERROR_MESSAGE('Title', 'valueMissing')} 
                                            </FieldFeedback>
                                        </FieldFeedbacks>
                                    </div>
                                    <div className="d-flex flex-column mb-2">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label className="control-label">
                                                    Deskripsi
                                                </label>
                                                <InputTextArea
                                                    value={desc}
                                                    changeEvent={(val, e) => this._changeInputHandler('desc', val, e)}
                                                    row="5"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label>Image</label>
                                                <InputFile                 
                                                    value={image}
                                                    placeHolder="Pilih File"
                                                    style={{ objectFit: 'contain', height: '325px' }}
                                                    changeEvent={(val) => this.setImage(val)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column mb-2">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label className="control-label">
                                                    Price ($)
                                                    {' '}
                                                    <span className="text-red"> * </span>
                                                </label>
                                                <InputPercent
                                                    value={price}
                                                    changeEvent={(val, e) => this._changeInputHandler('price', val, e)}
                                                    name="price"
                                                    desimal
                                                    maxDecimalPlaceLen={2}
                                                    required
                                                />
                                                <FieldFeedbacks for="price">
                                                    <FieldFeedback when="valueMissing">
                                                        {GENERATE_ERROR_MESSAGE('Price ($)', 'valueMissing')} 
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="control-label">
                                                    Stock
                                                    {' '}
                                                    <span className="text-red"> * </span>
                                                </label>
                                                <InputPercent
                                                    value={stock}
                                                    changeEvent={(val, e) => this._changeInputHandler('stock', val, e)}
                                                    name="stock"
                                                    desimal
                                                    maxDecimalPlaceLen={2}
                                                    required
                                                />
                                                <FieldFeedbacks for="stock">
                                                    <FieldFeedback when="valueMissing">
                                                        {GENERATE_ERROR_MESSAGE('Stock', 'valueMissing')} 
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-12">
                                            <div className='d-flex justify-content-end'>
                                                <Button
                                                    label="Kembali"
                                                    className="btn btn-default mx-2"
                                                    onClick={() => this.handelNavigate('/')}
                                                />
                                                <Button
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

export default withHocks(EditForm);