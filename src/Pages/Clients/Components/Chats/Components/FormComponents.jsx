import React, { useContext, useState } from 'react'
import update from "immutability-helper";
import { v4 as uuid } from "uuid";
import { NotificationManager } from 'react-notifications';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';

import { db } from '../../../../../firebase';

import { ChatContext } from '../../../../../Context/ChatContext';
import { AuthContext } from '../../../../../Context/AuthContext';

import InputText from '../../../../../Components/form/InputText';
import Modals from '../../../../../Components/Modals';
import Button from '../../../../../Components/Button';
import Image from '../../../../../Components/Image';
import Video from '../../../../../Components/Video';

import { uploadFile } from '../../../../../Data/uploadFile';

import { catchError } from '../../../../../Helper/helper';
import { checkThisFileIsImageOrNot } from '../../../../../Helper/checkFile';

import { DEFAULT_IMAGE } from "../../../../../Enum/DefaultValue";

const FormComponents = () => {
    const [form, setForm] = useState({ text: '', file: null });
    const [onSend, setOnSend] = useState(false);
    const { text, file } = form;

    const { currentUser } = useContext(AuthContext);
    const { data: { chatId , user: { userInfo: { uid } } } } = useContext(ChatContext);

    const ChangeInputHandler = async (type, val) => {
        const newForm = update(form, {
            [type]: { $set: val },
        });

        setForm(newForm);
    };

    const handleSend = async () => {
        setOnSend(true);
    
        try {
            if (file) {
                const thisFileisImage = checkThisFileIsImageOrNot(file);
                const uploadImage = await uploadFile( file, thisFileisImage ? "message/images/" : "message/videos" );
        
                await updateDoc(doc(db, "chats", chatId), {
                    messages: arrayUnion({
                        id: uuid(),
                        text,
                        senderId: currentUser.uid,
                        date: Timestamp.now(),
                        img: uploadImage,
                    }),
                });
            } else {
                await updateDoc(doc(db, "chats", chatId), {
                    messages: arrayUnion({
                        id: uuid(),
                        text,
                        senderId: currentUser.uid,
                        date: Timestamp.now(),
                    }),
                });
            }
    
            let lastMessageText = text;
            if (file && text === "") {
                lastMessageText = checkThisFileIsImageOrNot(file) ? "Mengkirimkan File" : "Mengikirimkan Video";
            }
        
            await updateDoc(doc(db, "userChats", currentUser.uid), {
                [chatId + ".lastMessage"]: {
                    text: lastMessageText,
                },
                [chatId + ".date"]: serverTimestamp(),
            });
        
            await updateDoc(doc(db, "userChats", uid), {
                [chatId + ".lastMessage"]: {
                    text: lastMessageText,
                },
                [chatId + ".date"]: serverTimestamp(),
            });
        
            await setForm({ text: '', file: null });
            } catch (err) {
                NotificationManager.error(catchError(err), "Terjadi Kesalahan", 5000);
            } finally {
            await setOnSend(false);
        }
    };

    return (
        <div className="row">
          <div className="col-md-6 col-xs-12 my-2">
            <InputText
              name="message"
              placeholder="Isi Pesan Anda..."
              value={text}
              changeEvent={(val, e) => ChangeInputHandler('text', val)}
              disabled={onSend}
            />
          </div>
          <div className="col-md-6 col-xs-12 my-2">
            <div className="d-flex">
              <div className="d-flex align-items-center flex-column w-100 mx-2">
                <Modals
                  buttonIcon="fas fa-file mx-2"
                  buttonLabel="File"
                  className="w-100"
                  btnSubmitHandel={handleSend}
                  btnCancelHandel={() => ChangeInputHandler('file', null)}
                  btnSubmitText={onSend ? "" : "Kirim"}
                  disabled={onSend}
                  buttonSubmitIcon={onSend ? "fas fa-sync-alt fa-spin" : "fa fa-paper-plane mr-2"}
                  btnSubmitDisabled={onSend || (text === "" && file === null)}
                >
                  <div className="row">
                    <div className="col-md-12 my-2">
                      {file ? (
                        <>
                          {checkThisFileIsImageOrNot(file) ? (
                            <Image
                              src={URL.createObjectURL(file)}
                              className="rounded w-100"
                              style={{ objectFit: "cover" }}
                              alt="Preview Image"
                            />
                          ) : (
                            <Video
                              src={URL.createObjectURL(file)}
                              className="rounded w-100"
                              style={{ objectFit: "cover" }}
                              alt="Preview Image"
                            />
                          )}
                        </>
                      ) : (
                        <Image
                          src={file ? URL.createObjectURL(file) : DEFAULT_IMAGE}
                          className="rounded w-100"
                          style={{ objectFit: "cover" }}
                          alt="Preview Image"
                        />
                      )}
                      <input
                        id="file"
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          try {
                            ChangeInputHandler('file', e.target.files[0])
                          } catch {
                            ChangeInputHandler('file', null)
                          }
                        }}
                      />
                      <label
                        htmlFor="file"
                        className="mt-2 w-100"
                        style={{ marginBottom: "unset" }}
                      >
                        <div className="btn btn-default w-100">
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
                        changeEvent={(val, e) => ChangeInputHandler('text', val)}
                        disabled={onSend}
                      />
                    </div>
                  </div>
                </Modals>
              </div>

              <Button
                label={onSend || "Kirim"}
                className="btn btn-primary rounded w-100 mx-2"
                buttonIcon={
                  onSend ? "fas fa-sync-alt fa-spin" : "fa fa-paper-plane"
                }
                onClick={handleSend}
                disabled={onSend || (text === "" && file === null)}
              />
            </div>
          </div>
        </div>
    )
}

export default FormComponents;
