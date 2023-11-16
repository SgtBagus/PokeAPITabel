import React, { StrictMode } from 'react';

import { ChatContextProvider } from "../../context/ChatContext";

import UserList from './componentsV2/UserList';
import Chat from './componentsV2/Chat';

const ChatV2 = () =>  {
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
                                <Chat titleChat="Kirim Pesan Ke" />
                            </div>
                        </div>
                    </div>
                </div>
            </StrictMode>
        </ChatContextProvider>
    );
}

export default ChatV2;
