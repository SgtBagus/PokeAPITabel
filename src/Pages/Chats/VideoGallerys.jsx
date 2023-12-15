import React, { StrictMode, useContext, useEffect } from 'react';

import { ChatContextProvider } from "../../context/ChatContext";

import UserList from './components/UserList';
import UserProfile from './components/UserProfile';
import VideoComponents from './components/VideoComponents';

import { LoadingContext } from '../../context/LoadingContext';

const VideoGallerys = () =>  {
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
                                <VideoComponents />
                            </div>
                        </div>
                    </div>
                </div>
            </StrictMode>
        </ChatContextProvider>
    );
}

export default VideoGallerys;
