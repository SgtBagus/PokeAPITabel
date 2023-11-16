import React, { useEffect, useRef } from "react";

import PropTypes from 'prop-types';

import Image from '../../../components/Image';
import Video from '../../../components/Video';

import fireBaseTime from '../../../Helper/fireBaseTime';
import { checkfileUrl } from '../../../Helper/checkFile';

const Chat = ({
    titleChat,
    dataUser: {
        displayName: userDisplayName,
        photoURL: userPhotoURL,
    },
    dataMessage: { messages },
    dataLogin: {
        uid: currentUid,
        displayName: currentDisplayName,
        photoURL: currentPhotoURL,
    },
}) => {
    const ref = useRef();

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, []);
      
    return (
        <div className="card card-outline direct-chat direct-chat-primary">
            <div className="card-header">
                <h3 className="card-title">
                    {titleChat} - { userDisplayName }
                </h3>
            </div>
            <div className="card-body">
                <div
                    className="direct-chat-messages"
                    style={{
                        height: '450px',
                    }}
                >
                    {
                        messages.map((
                            { date, id, img, senderId, text }
                        ) => {
                            return (
                                <div
                                    ref={ref}
                                    key={id}
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
                                    { senderId === currentUid ? currentDisplayName : userDisplayName }
                                    </span>
                                </div>
                                <div
                                    className={`d-flex ${senderId === currentUid && 'flex-row-reverse'}`}
                                >
                                    <Image
                                        className="direct-chat-img"
                                        src={senderId === currentUid ? currentPhotoURL : userPhotoURL}
                                        alt={senderId === currentUid ? 'Foto Pengguna' : 'Foto Admin'}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            objectFit: 'cover',
                                        }}
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
                                                                    width: '350px',
                                                                    objectFit: 'cover',
                                                                }}
                                                            />
                                                        )
                                                        : (
                                                            <Video
                                                                className="my-2"
                                                                src={img}
                                                                style={{
                                                                    objectFit: 'cover',
                                                                    width: '350px',
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
                                                    {text}
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
                            )
                        })
                    }
                </div>
            </div>
            <div className="card-footer">
                <form action="#" method="post">
                    <div className="input-group">
                        <input type="text" name="message" placeholder="Type Message ..." className="form-control" />
                        <span className="input-group-append">
                            <button type="submit" className="btn btn-primary">Send</button>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    )
}


Chat.propTypes = {
    titleChat: PropTypes.string,
    data: PropTypes.shape({
        messages: PropTypes.arrayOf(
            PropTypes.shape({}).isRequired
        ),
        allow_chat: PropTypes.bool,
    })
};

Chat.defaultProps = {
    titleChat: 'Direct Chats',
    data: {
        messages: [],
        allow_chat: false,
    }
};

export default Chat;
