import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { AuthContext } from "../../../context/AuthContext";
import { ChatContext } from "../../../context/ChatContext";
import { db } from "../../../firebase";

import Card from "../../../components/Card";
import Image from "../../../components/Image";
import InputTextIcon from "../../../components/form/InputTextIcon";

import fireBaseTime from '../../../Helper/fireBaseTime';

import './style.scss';
import Loading from "../../../components/Loading";

const UserList = () => {
    const [chats, setChats] = useState([]);
    const [chatsFilter, setChatsFilter] = useState([]);

    const [textSearch, setTextSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const { currentUser } = useContext(AuthContext);
    const { dispatch, data } = useContext(ChatContext);

    useEffect(() => {
        setIsLoading(true);

        const getChats = async () => {
            const unsub = await onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                const arrayOfObject = (chatId, userInfo) => ({ chatId, userInfo });
                const dataToArray = Object.entries(doc.data()).map(x => arrayOfObject(x[0], x[1]));

                setChats(dataToArray);
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

    const searchUserHandel = (val) => {
        setTextSearch(val);
        
        const filterValue = chats.filter((data) => {
            const userName = data.userInfo.userInfo.displayName.toLowerCase();
            return userName.match(val.toLowerCase());
        });

        setChatsFilter(filterValue)
    }

    const renderChats = textSearch !== '' ? chatsFilter : chats;

    return (
        <Card
            title="List Pengguna"
            type="card-primary"
        >
            <InputTextIcon
                name="message"
                placeholder="Pencarian..."
                value={textSearch}
                changeEvent={(val, e) => searchUserHandel(val)}
                icon="fas fa-search"
            />
            <hr />
            <div
                style={{
                    height: !isLoading ? '550px' : '100px',
                    overflow: 'auto',
                }}
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
                                {
                                    renderChats.sort((a, b) => b.userInfo.date - a.userInfo.date ).map(({ chatId, userInfo }) => {
                                        const {
                                            date,
                                            lastMessage,
                                            userInfo: {
                                                displayName,
                                                photoURL,
                                                uid,
                                            }
                                        } = userInfo;

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
                                    })
                                }
                            </ul>
                        </>
                    )
                }
            </div>
        </Card>
    );
};

export default UserList;
