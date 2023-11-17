import React, { StrictMode } from 'react';

import { ChatContextProvider } from "../../context/ChatContext";

import UserList from './components/UserList';
import Chat from './components/Chat';
import UserProfile from './components/UserProfile';

const ChatPages = () =>  {
    return (
        <ChatContextProvider>
            <StrictMode>
                <div className="row">
                    <div className="col-12">
                        <h4 className="mt-4 mb-2">User List</h4>
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
