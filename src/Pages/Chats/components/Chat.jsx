import React, { useContext, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { NotificationManager } from "react-notifications";
import {
  arrayUnion,
  doc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

import { ChatContext } from "../../../context/ChatContext";
import { AuthContext } from "../../../context/AuthContext";

import { db } from "../../../firebase";

import InputText from "../../../components/form/InputText";
import Modals from "../../../components/Modals";
import ButtonComponents from "../../../components/Button";

import { uploadFile } from "../../../Data/uploadFile";

import { checkThisFileIsImageOrNot } from "../../../Helper/checkFile";
import { catchError } from "../../../Helper/helper";

import defaultImage from "./defaultImage.png";
import Image from "../../../components/Image";
import Video from "../../../components/Video";

import MessagesComponents from "./MessagesComponents";
import EmptyChat from "./EmptyChat";

const Chat = ({ titleChat }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [onSend, setOnSend] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { data: { chatId, user: { userInfo: { uid, displayName } } } } = useContext(ChatContext);

  useEffect(() => {
    setIsLoading(true);
    const unSub = onSnapshot(doc(db, "chats", chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);

      setIsLoading(false);
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleSend = async () => {
    setOnSend(true);

    try {
      if (file) {
        const thisFileisImage = checkThisFileIsImageOrNot(file);
        const uploadImage = await uploadFile(
          file,
          thisFileisImage ? "message/images/" : "message/videos"
        );

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
        lastMessageText = checkThisFileIsImageOrNot(file)
          ? "Mengkirimkan File"
          : "Mengikirimkan Video";
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

      await setText("");
      await setFile(null);
    } catch (err) {
      NotificationManager.error(catchError(err), "Terjadi Kesalahan", 5000);
    } finally {
      await setOnSend(false);
    }
  };

  return (
    <>
      {chatId !== "null" ? (
        <div className="card card-outline direct-chat direct-chat-primary">
          <div className="card-header">
            <h3 className="card-title">
              {titleChat} - {displayName}
            </h3>
          </div>
          <div className="card-body">
            <div className="direct-chat-messages" style={{ height: "450px" }}>
              {messages.map((m) => (
                <MessagesComponents message={m} key={m.id} />
              ))}
            </div>
          </div>
          {isLoading && (
            <div className="overlay">
              <i className="fas fa-2x fa-sync-alt fa-spin"></i>
            </div>
          )}
          <div className="card-footer">
            <div className="row">
              <div className="col-md-6 col-xs-12 my-2">
                <InputText
                  name="message"
                  placeholder="Isi Pesan Anda..."
                  value={text}
                  changeEvent={(val, e) => setText(val)}
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
                      btnCancelHandel={() => setFile(null)}
                      btnSubmitText={onSend ? "" : "Kirim"}
                      disabled={onSend}
                      buttonSubmitIcon={
                        onSend
                          ? "fas fa-sync-alt fa-spin"
                          : "fa fa-paper-plane mr-2"
                      }
                      btnSubmitDisabled={
                        onSend || (text === "" && file === null)
                      }
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
                              src={
                                file ? URL.createObjectURL(file) : defaultImage
                              }
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
                                setFile(e.target.files[0]);
                              } catch {
                                setFile(null);
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
                            changeEvent={(val, e) => setText(val)}
                            disabled={onSend}
                          />
                        </div>
                      </div>
                    </Modals>
                  </div>

                  <ButtonComponents
                    label={onSend || "Kirim"}
                    className="btn-primary w-100 mx-2"
                    buttonIcon={ onSend ? "fas fa-sync-alt fa-spin" : "fa fa-paper-plane" }
                    onClick={handleSend}
                    disabled={onSend || (text === "" && file === null)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EmptyChat />
      )}
    </>
  );
};

export default Chat;
