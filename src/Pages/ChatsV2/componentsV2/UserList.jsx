import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { AuthContext } from "../../../context/AuthContext";
import { ChatContext } from "../../../context/ChatContext";
import { db } from "../../../firebase";

import Card from "../../../components/Card";
import Image from "../../../components/Image";

import fireBaseTime from '../../../Helper/fireBaseTime';

import './style.scss';
import Loading from "../../../components/Loading";

const UserList = () => {
    const [chats, setChats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { currentUser } = useContext(AuthContext);
    const { dispatch, data } = useContext(ChatContext);

    useEffect(() => {
        setIsLoading(true);

        const getChats = async () => {
            const unsub = await onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                setChats(doc.data());
                setIsLoading(false);
            });

            return async () => {
                unsub();
            };
        };

        currentUser.uid && getChats();
    }, [currentUser.uid]);

    const handleSelect = (u) => {
        dispatch({ type: "CHANGE_USER", payload: u });
    };

    return (
        <Card
            title="List Pengguna"
            type="card-primary"
            height={!isLoading ? '660px' : '100px'}
        >
            {
                isLoading ? (
                    <div className="container h-100">
                        <div className="d-flex flex-column align-items-center justify-content-center h-100">
                            <Loading title="Memuat..." />
                        </div>
                    </div>
                )
                : (
                    <>
                        <ul
                            className="nav nav-pills nav-sidebar flex-column chats-user-container
                        ">
                            {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => {
                                const chatId = chat[0];
                                const {
                                    userInfo, date, lastMessage,
                                } = chat[1];

                                const { photoURL, displayName, uid } = userInfo;
                                const { user: { uid: selectedUid } } = data;

                                return (
                                    <li
                                        className="nav-item"
                                        key={chatId}
                                        onClick={() => handleSelect(userInfo)}
                                    >
                                        <div
                                            className={`nav-link chats-user-list ${uid === selectedUid && 'active'}`}
                                        >
                                            <div className="user-block" style={{ float: "unset" }}>
                                                <Image
                                                    className="img-circle img-bordered-sm"
                                                    src={photoURL}
                                                    alt={`User Photo - ${uid}`}
                                                />
                                                <span className="username">{displayName}</span>
                                                <span className="description">
                                                    {
                                                        lastMessage && (
                                                            <>
                                                                {lastMessage.text.length > 35 ? `${lastMessage.text.substring(0, 35)}...` : lastMessage.text}
                                                            </>
                                                        )
                                                    }
                                                <br />
                                                {
                                                    date && (
                                                        <>
                                                        {
                                                            `${fireBaseTime(date).toDateString().toString("MMMM yyyy")}
                                                            ${' '}
                                                            -
                                                            ${' '}
                                                            ${fireBaseTime(date).toLocaleTimeString()}`
                                                        }
                                                        </>
                                                    )
                                                }
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                )
            }
        </Card>
    );
};

export default UserList;
