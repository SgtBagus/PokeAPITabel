import React, { useContext, useEffect } from 'react';

import UserList from './Components/UserList';

import { LoadingContext } from '../../context/LoadingContext';
import { ChatContextProvider } from '../../context/ChatContext';

import './style.scss';
import Tabs from '../../components/Tabs';

const Client = () =>  {
    const { dispatchLoading } = useContext(LoadingContext);

    useEffect(() => {
        dispatchLoading(false);
    }, [dispatchLoading]);

    return (
        <div className="row">
            <div className="col-12">
                <ChatContextProvider>
                    <div className="row">
                        <div className="col-4">
                            <UserList />
                        </div>
                        <div className="col-8">
                            <Tabs />
                        </div>
                    </div>
                </ChatContextProvider>
            </div>
        </div>
    );
}

export default Client;
