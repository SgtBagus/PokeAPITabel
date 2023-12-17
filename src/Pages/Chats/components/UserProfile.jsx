import React, { useContext, useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

import { ChatContext } from "../../../context/ChatContext";

import { db } from "../../../firebase";

import Loading from "../../../components/Loading";
import Image from '../../../components/Image';
import Button from '../../../components/Button';

import defaultImage from './defaultImage.png';

import { catchError } from "../../../Helper/helper"

const UserProfile = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [allowChat, setAllowChat] = useState(false);
    const [isLoadingAllowChat, setIsLoadingAllowChat] = useState(false);

    const [dataUser, setDataUser] = useState({
        displayName: 'Username',
        photoURL: defaultImage,
        uid: 'null',
        email: 'useremail@gmail.com',
        userDesc: 'Desc',
    });

    const { data } = useContext(ChatContext);

    useEffect(() => {
        const {
            user: { userInfo: { uid: selectedUid } },
            chatId,
        } = data;

        setIsLoading(true);

        if (selectedUid) {
            const unSubMessage = onSnapshot(doc(db, "chats", chatId), async (doc) => {
                await doc.exists() && setAllowChat(doc.data().allow_chat);
            });

            const unSub = onSnapshot(doc(db, "users", selectedUid), async (doc) => {
                if (doc.exists()) {
                    await setDataUser(doc.data());
                    setIsLoading(false);

                    await unSubMessage();
                } else {
                    NotificationManager.error('Gagal Mengambil Data Pengguna', "Terjadi Kesalahan", 5000);
                }
            });

            return () => { unSub() };
        }
    }, [data]);
    
    const {
        displayName, photoURL, uid, email, userDesc,
    } = dataUser;
    
    const changeStatusMessage = async (value) => {
        const { chatId } = data;

        try {
            setIsLoadingAllowChat(true);
            await updateDoc(doc(db, 'chats', chatId), { allow_chat: value });
            setIsLoadingAllowChat(false);

            setAllowChat(value);
            NotificationManager.success('Berhasil Mengubah Status Messages', 'Berhasil', 5000);
        } catch(err) {
            NotificationManager.error(catchError(err), 'Terjadi Kesalahan', 5000);
        }
    }

    return (
        <>
            {
                data.user.userInfo.uid && (
                    <div className="card card-widget widget-user-2">              
                        {
                            isLoading && (
                                <Loading title="Memuat..." />
                            )
                        }
                        <div className="widget-user-header bg-info d-flex align-items-center">
                            <Image
                                className="img-circle img-bordered-sm mx-2"
                                src={photoURL}
                                alt={`User Profile - ${uid}`}
                                style={{ height: '85px', width: '85px', objectFit: 'cover' }}
                            />
                            <div className="mx-2">
                                <h3 className="widget-user-username m-0 my-1">{displayName}</h3>
                                <h5 className="widget-user-desc m-0 my-1">{email}</h5>

                                <div className="my-2">
                                    <div className="btn-group">
                                        <button type="button" className="btn btn-default btn-sm" data-toggle="collapse" href="#descUser">
                                            Detail pengguna
                                        </button>
                                        
                                        <Button
                                            label={
                                                isLoadingAllowChat ? 'Memperoses' : allowChat ? "Non Aktifkan Percakapan !" : 'Aktifkan Percakapan !'
                                            }
                                            className={`btn btn-${!allowChat ? 'primary' : 'danger' } btn-sm`}
                                            buttonIcon={isLoadingAllowChat && 'fas fa-sync-alt fa-spin'}
                                            onClick={() => changeStatusMessage(!allowChat)}
                                            disabled={isLoadingAllowChat}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer p-0">
                            <div id="descUser" className="collapse" data-parent="#descUser">
                                <div className="card-body">
                                    {
                                        userDesc ? userDesc : 'Belum ada Dekripsi Pengguna !'
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

UserProfile.propTypes = {
};

UserProfile.defaultProps = {
};

export default UserProfile;
