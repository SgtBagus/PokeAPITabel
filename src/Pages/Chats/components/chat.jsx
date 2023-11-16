import React, { Component } from 'react';
import update from "immutability-helper";

import InputText from '../../../components/form/InputText';
import Modals from '../../../components/Modals';
import ButonComponents from '../../../components/Button';

import MessagesComponents from './messages';

import defaultImage from './defaultImage.png';

class Chat extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            messages: [],
            form: {
                text: '',
                file: null,
            },
            onSend: false,
        };
    }

    componentDidMount = () => {
        const {
            dataMessage: { messages }
        } = this.props;
        this.setState({
            messages,
        })
    }

    componentDidUpdate = ({
        dataMessage: { messages: pMessages }
    }) => {
        const { dataMessage: { messages } } = this.props;

        if (messages !== pMessages) {
            this.setState({
                messages,
            })
        }
    }

    handleSend = () => {
        console.log('test');
    }
    
    
    _changeInputHandler = async (type, val, e) => {
        const { form } = this.state;

        const newForm = update(form, {
            [type]: { $set: val },
        });

        this.setState({
            form: newForm,
        });
    };

    render() {
        const {
            titleChat,
            dataUser: {
                displayName: userDisplayName,
                photoURL: userPhotoURL,
            },
            dataLogin: {
                uid: currentUID,
                displayName: currentDisplayName,
                photoURL: currentPhotoURL,
            },
        } = this.props;

        const {
            messages, 
            form: { text, file }, onSend,
        } = this.state;

        return (
            <div className="card card-outline direct-chat direct-chat-primary">
                <div className="card-header">
                    <h3 className="card-title">
                        {titleChat} - { userDisplayName }
                    </h3>
                </div>
                <div className="card-body">
                    <div
                        className="direct-chat-messages"
                        style={{ height: '450px' }}
                    >
                        {
                            messages.map((
                                { date, id, img, senderId, text }
                            ) => {
                                return (
                                    <MessagesComponents
                                        key={id}
                                        id={id}
                                        text={text}
                                        date={date}
                                        img={img}
                                        senderId={senderId}
                                        currentUID={currentUID}
                                        currentDisplayName={currentDisplayName}
                                        userDisplayName={userDisplayName}
                                        currentPhotoURL={currentPhotoURL}
                                        userPhotoURL={userPhotoURL}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
                <div className="card-footer">
                    <div className='row'>
                        <div className="col-md-6 col-xs-12 my-2">
                            <InputText
                                name="message"
                                placeholder="Isi Pesan Anda..."
                                value={text}
                                changeEvent={(val, e) => this._changeInputHandler('text', val, e)}
                                disabled={onSend}
                            />
                        </div>
                        <div className="col-md-6 col-xs-12 my-2">
                            <div className='d-flex'>
                                <div className="d-flex align-items-center flex-column w-100 mx-2">
                                    <Modals
                                        buttonIcon="fas fa-file mx-2"
                                        buttonLabel="Gambar"
                                        className="w-100"
                                        btnSubmitHandel={this.handleSend}
                                        btnCancelHandel={() => this._changeInputHandler('file', null, null)}
                                        btnSubmitText={onSend ? '' : 'Kirim'}
                                        disabled={onSend}
                                        buttonSubmitIcon={onSend ? "fas fa-sync-alt fa-spin" : 'fa fa-paper-plane mr-2'}
                                        btnSubmitDisabled={onSend || (( text === '') && (file === null) )}
                                    >
                                        <div className="row">
                                            <div className="col-md-12 my-2">
                                                <img
                                                    src={file ? URL.createObjectURL(file) : defaultImage}
                                                    className="rounded w-100"
                                                    style={{ objectFit: 'cover' }}
                                                    alt=""
                                                />
                                                <input
                                                    id="file"
                                                    type="file"
                                                    accept="image/png, image/gif, image/jpeg"
                                                    style={{ display: "none" }}
                                                    onChange={(e) => {
                                                        try {
                                                            this._changeInputHandler('file', e.target.files[0], null);
                                                        } catch {
                                                            this._changeInputHandler('file', null, null);
                                                        }
                                                    }}
                                                />
                                                <label htmlFor="file" className="mt-2 w-100" style={{ marginBottom: 'unset' }}>
                                                    <div
                                                        className="btn btn-default w-100"
                                                    >
                                                        <i className="fas fa-file mr-2" />
                                                        {!file ? "Upload File" : "Ganti File"}
                                                    </div>
                                                </label>
                                            </div>
                                            <div className="col-md-12 my-2">
                                                <InputText
                                                    name="message"
                                                    placeholder="Isi Pesan Anda..."
                                                    value={text}
                                                    changeEvent={(val, e) => this._changeInputHandler('text', val, e)}
                                                    disabled={onSend}
                                                />
                                            </div>
                                        </div>
                                    </Modals>
                                </div>
                                <ButonComponents
                                    type="button"
                                    buttonType="btn-primary w-100 mx-2"
                                    buttonAction={this.handleSend}
                                    buttonText={onSend || 'Kirim'}
                                    buttonIcon={onSend ? "fas fa-sync-alt fa-spin" : 'fa fa-paper-plane'}
                                    disabled={onSend || (( text === '') && (file === null) )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;
