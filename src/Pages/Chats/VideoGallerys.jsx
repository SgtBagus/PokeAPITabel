import React, { StrictMode, useContext, useEffect } from 'react';

import { ChatContextProvider } from "../../Context/ChatContext";

import UserList from './Components/UserList';
import UserProfile from './Components/UserProfile';
import VideoComponents from './Components/VideoComponents';

import { LoadingContext } from '../../Context/LoadingContext';

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
