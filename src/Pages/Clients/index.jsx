import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import Tabs from "../../Components/Tabs";

import NonSelectedClient from "./Components/NonSelectedClient";
import UserList from "./Components/UserList";
import UserProfile from "./Components/UserProfile";

import { LoadingContext } from "../../Context/LoadingContext";
import { ChatContext } from "../../Context/ChatContext";
import { AuthContext } from "../../Context/AuthContext";
import { ButtonContext } from "../../Context/ButtonContext";

import { TABS_LIST } from "./config";

import { db } from "../../firebase";

import "./style.scss";

const Client = () => {
    const [chats, setChats] = useState([]);

    const { dispatchLoading } = useContext(LoadingContext);
    const { data: { chatId } } = useContext(ChatContext);
    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ButtonContext);

    useEffect(() => {
        dispatchLoading(true);

        dispatch({
            typeSwtich: "CHANGE_BUTTON",
            dataButtonList: []
        });
        
        const getChats = async () => {
            const unsub = await onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                const arrayOfObject = (chatId, userInfo) => ({ chatId, userInfo });
                const dataToArray = Object.entries(doc.data()).map(x => arrayOfObject(x[0], x[1]));

                setChats(dataToArray);
                dispatchLoading(false);
            });

            return async () => {
                unsub();
            };
        };

        currentUser.uid && getChats();
    }, [currentUser.uid, dispatchLoading]);

    return (
        <div className="row">
            <div className="col-4">
                <UserList clientLists={chats} />
            </div>
            <div className="col-8">
                {
                    chatId !== "null" ? (
                        <>
                            <UserProfile />
                            <Tabs data={TABS_LIST} />
                        </>
                    ) : (
                        <NonSelectedClient />
                    )
                }
            </div>
        </div>
    );
};

export default Client;
