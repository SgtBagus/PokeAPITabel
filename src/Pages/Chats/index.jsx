import React, { StrictMode, useContext, useEffect } from 'react';

import { ChatContextProvider } from "../../context/ChatContext";
import { LoadingContext } from '../../context/LoadingContext';

import UserList from './components/UserList';
import Chat from './components/Chat';
import UserProfile from './components/UserProfile';

const ChatPages = () =>  {
    const { dispatchLoading } = useContext(LoadingContext);

    useEffect(() => {
        dispatchLoading(false);
    }, [dispatchLoading]);

    return (
        <ChatContextProvider>
            <StrictMode>
                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-4">
                                <UserList />
                            </div>
                            <div className="col-8">
                                <UserProfile />
                                <Chat titleChat="Kirim Pesan Ke" />
                            </div>
                        </div>
                    </div>
                </div>
            </StrictMode>
        </ChatContextProvider>
    );
}

export default ChatPages;
