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

    return (
        <div
            ref={ref}
            className={`direct-chat-msg ${message.senderId === currentUser.uid && 'right' } my-4`}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.senderId === currentUser.uid ? ('flex-end') : ('flex-start'),
            }}
          
        >
            <div className="direct-chat-infos clearfix">
                <span
                    className={`direct-chat-name ${message.senderId === currentUser.uid ? 'float-right' : 'float-left' }`}
                >
                {
                    message.senderId === currentUser.uid
                    ? currentUser.displayName
                    : data.user.displayName
                }
                </span>
            </div>
            <div
                className={`d-flex ${message.senderId === currentUser.uid && 'flex-row-reverse'}`}
            >
                <Image
                    className="direct-chat-img"
                    src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL}
                    alt={message.senderId === currentUser.uid ? `Admin Profile ${message.id}` : `Users Profile ${message.id}`}
                />
                <div className="d-flex flex-column">
                {
                    message.img && (
                    <div
                        className="m-2"
                        style={{
                            float: message.senderId === currentUser.uid ? 'right' : 'left',
                        }}
                    >
                        {
                            checkfileUrl(message.img)
                            ? (
                                <Image
                                    className="my-2"
                                    src={message.img}
                                    alt={`messages-images-${message.id}`}
                                    style={{
                                        width: "350px",
                                        objectFit: "cover",
                                    }}
                                />
                            )
                            : (
                                <Video
                                    className="my-2"
                                    src={message.img}
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
                    message.text !== '' && (
                        <div
                            className="direct-chat-text my-2"
                            style={{
                            float: message.senderId === currentUser.uid ? 'right' : 'left',
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
                className={`direct-chat-timestamp ${message.senderId === currentUser.uid ? 'float-right' : 'float-left' }`}
            >
                {`${fireBaseTime(message.date).toDateString().toString("MMMM yyyy")} - ${fireBaseTime(message.date).toLocaleTimeString()}`}
            </span>
        </div>
    );
};

MessagesComponents.propTypes = {};

MessagesComponents.defaultProps = {};

export default MessagesComponents;
