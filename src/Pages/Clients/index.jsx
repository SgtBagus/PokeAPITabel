import React, { useContext, useEffect } from "react";

import Tabs from "../../Components/Tabs";

import EmptyChat from "./Components/EmptyChat";
import UserList from "./Components/UserList";
import UserProfile from "./Components/UserProfile";

import { LoadingContext } from "../../Context/LoadingContext";
import { ChatContext } from "../../Context/ChatContext";

import { TABS_LIST } from "./config";

import "./style.scss";

const Client = () => {
    const { dispatchLoading } = useContext(LoadingContext);
    const { data: { chatId } } = useContext(ChatContext);

    useEffect(() => {
        dispatchLoading(false);
    }, [dispatchLoading]);

    return (
        <div className="row">
            <div className="col-12">
                <div className="row">
                    <div className="col-4">
                        <UserList />
                    </div>
                    <div className="col-8">
                        {
                            chatId !== "null" ? (
                                <>
                                    <UserProfile />
                                    <Tabs data={TABS_LIST} />
                                </>
                            ) : (
                                <EmptyChat />
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Client;
