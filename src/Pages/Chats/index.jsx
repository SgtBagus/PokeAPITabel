import React, { StrictMode, useContext, useEffect } from 'react';

import { ChatContextProvider } from "../../Context/ChatContext";
import { LoadingContext } from '../../Context/LoadingContext';

import UserList from './Components/UserList';
import Chat from './Components/Chat';
import UserProfile from './Components/UserProfile';

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
