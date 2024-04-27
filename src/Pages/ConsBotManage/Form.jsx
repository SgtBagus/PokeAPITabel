import React, { Component } from "react";
import { FieldFeedback, FieldFeedbacks } from "react-form-with-constraints";
import update from "immutability-helper";


import { withHocks } from "../../Context/WithParams";

import FormValidation from "../../Components/FormValidation";

import Card from "../../Components/Card";
import Button from '../../Components/Button';

import InputText from "../../Components/form/InputText";
import InputTextArea from "../../Components/form/InputTextArea";
import TextEditor from "../../Components/form/TextEditor";

import { GENERATE_ERROR_MESSAGE } from "../../Helper/error";

class ConsBotManageForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        id: '',
        intent: '',
        utterances: [
            "say about you",
            "why are you here",
            "what is your personality",
            "describe yourself",
        ],
        answers: [
            "I'm a virtual agent",
            "Think of me as a virtual agent",
            "Well, I'm not a person, I'm a virtual agent",
        ]
      },
      isFormSubmitted: false,
    };
  }

  componentDidMount = () => {
    const {
      loadingParam: { dispatchLoading },
    } = this.props;

    dispatchLoading(false);
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

    changeAnswer = (val, idx) => {
        console.log(idx);
        console.log(val);
    }

    render() {
        const {
            form: { 
                intent, utterances, answers,
            }
        } = this.state;

        return (
            <Card>
                <h5>Create New Argumt Key</h5>
                <hr />
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
                                                    changeEvent={(val, e) => this._changeInputHandler('note', val, e)}
                                                    row="3"
                                                    name="note"
                                                    placeholder="Catatan"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Button
                                                    className="btn btn-danger rounded mx-2"
                                                    buttonIcon="fa fa-trash"
                                                    onClick={() => {}}
                                                />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            
                            <Button
                                label="Tambah Utterances - (Ucapan)"
                                className="btn btn-primary rounded w-100 mx-2"
                                onClick={() => {}}
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
                                                <TextEditor
                                                    value={x}
                                                    changeEvent={(val) => { this.changeAnswer(val, idx) }}
                                                />
                                            </div>
                                            <div>
                                                <Button
                                                    className="btn btn-danger rounded mx-2"
                                                    buttonIcon="fa fa-trash"
                                                    onClick={() => {}}
                                                />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            
                            <Button
                                label="Tambah Answers - (Jawaban)"
                                className="btn btn-primary rounded w-100 mx-2"
                                onClick={() => {}}
                            />
                        </div>
                    </div>
                    <div className="d-flex flex-column mb-2">
                        <div className="d-flex justify-content-end">
                            <Button
                                label="Back"
                                className="btn btn-default rounded mx-2"
                                buttonIcon="fa fa-arrow-left"
                                onClick={() => {}}
                            />
                            <Button
                                label="Save"
                                className="btn btn-primary rounded mx-2"
                                buttonIcon="fa fa-save"
                                onClick={() => {}}
                            />
                        </div>
                    </div>
                </FormValidation>
            </Card>
        );
    }
}

export default withHocks(ConsBotManageForm);
