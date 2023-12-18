import React, { useContext, useState } from "react";

import { ChatContext } from "../../../Context/ChatContext";

import Card from "../../../Components/Card";
import Image from "../../../Components/Image";

import InputTextIcon from "../../../Components/form/InputTextIcon";

import fireBaseTime from '../../../Helper/fireBaseTime';

const UserList = ({ clientLists }) => {
    const [chatsFilter, setChatsFilter] = useState([]);
    const [textSearch, setTextSearch] = useState('');

    const { dispatch, data } = useContext(ChatContext);

    const handleSelect = (u) => {
        dispatch({ type: "CHANGE_USER", payload: u });
    };

    const searchUserHandel = (val) => {
        setTextSearch(val);
        
        const filterValue = clientLists.filter((data) => {
            const userName = data.userInfo.userInfo.displayName.toLowerCase();
            return userName.match(val.toLowerCase());
        });

        setChatsFilter(filterValue)
    }

    const renderChats = textSearch !== '' ? chatsFilter : clientLists;

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
                    height: '60vh',
                    overflow: 'auto',
                }}
            >
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
            </div>
        </Card>
    );
};

export default UserList;
