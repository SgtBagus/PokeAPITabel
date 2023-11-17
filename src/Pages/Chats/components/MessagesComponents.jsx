import React, { useContext, useEffect, useRef } from "react";

import { AuthContext } from "../../../context/AuthContext";
import { ChatContext } from "../../../context/ChatContext";

import Image from "../../../components/Image";
import Video from "../../../components/Video";

import fireBaseTime from "../../../Helper/fireBaseTime";

import { checkfileUrl } from "../../../Helper/checkFile";

const MessagesComponents = ({ message }) => {
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const ref = useRef();
  
    useEffect(() => {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    const { senderId, id, img, text, date } = message;
    const { user: { userInfo: { displayName, photoURL } } } = data;
    const { displayName: curerntDisplayName, uid: currentUid, photoURL: currentPhotoURL } = currentUser;
    
    return (
        <div
            ref={ref}
            className={`direct-chat-msg ${senderId === currentUid && 'right' } my-4`}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: senderId === currentUid ? ('flex-end') : ('flex-start'),
            }}    
        >
            <div className="direct-chat-infos clearfix">
                <span
                    className={`direct-chat-name ${senderId === currentUid ? 'float-right' : 'float-left' }`}
                >
                    { senderId === currentUid ? curerntDisplayName : displayName }
                </span>
            </div>
            <div
                className={`d-flex ${senderId === currentUid && 'flex-row-reverse'}`}
            >
                <Image
                    className="direct-chat-img"
                    src={senderId === currentUid ? currentPhotoURL : photoURL}
                    alt={senderId === currentUid ? `Admin Profile ${id}` : `Users Profile ${id}`}
                />
                <div className="d-flex flex-column">
                    {
                        img && (
                            <div
                                className="m-2"
                                style={{
                                    float: senderId === currentUid ? 'right' : 'left',
                                }}
                            >
                                {
                                    checkfileUrl(img)
                                    ? (
                                        <Image
                                            className="my-2"
                                            src={img}
                                            alt={`messages-images-${id}`}
                                            style={{
                                                width: "350px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    )
                                    : (
                                        <Video
                                            className="my-2"
                                            src={img}
                                            style={{
                                                objectFit: "cover",
                                                width: "350px",
                                            }}
                                        />
                                    )
                                }
                            </div>
                        )
                    }
                    {
                        text !== '' && (
                            <div
                                className="direct-chat-text my-2"
                                style={{
                                    float: senderId === currentUid ? 'right' : 'left',
                                    margin: '0 15px',
                                    wordBreak: 'keep-all',
                                }}
                            >
                                {message.text}
                            </div>
                        )
                    }
                </div>
            </div>
            <span
                className={`direct-chat-timestamp ${senderId === currentUid ? 'float-right' : 'float-left' }`}
            >
                {`${fireBaseTime(date).toDateString().toString("MMMM yyyy")} - ${fireBaseTime(date).toLocaleTimeString()}`}
            </span>
        </div>
    );
};

MessagesComponents.propTypes = {};

MessagesComponents.defaultProps = {};

export default MessagesComponents;
