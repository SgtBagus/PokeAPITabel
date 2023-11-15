import React from 'react'
import PropTypes from 'prop-types';

import Image from '../../../components/Image';

const Chat = ({
    titleChat,
}) => {
    return (
        <div className="card card-primary card-outline direct-chat direct-chat-primary">
            <div className="card-header">
                <h3 className="card-title">{titleChat}</h3>
            </div>
            <div className="card-body">
                <div className="direct-chat-messages">
                    <div className="direct-chat-msg">
                        <div className="direct-chat-infos clearfix">
                            <span className="direct-chat-name float-left">Alexander Pierce</span>
                            <span className="direct-chat-timestamp float-right">23 Jan 2:00 pm</span>
                        </div>
                        <Image
                            className="direct-chat-img"
                            src="https://images2.alphacoders.com/130/1301500.jpg"
                            alt="Foto Pengguna"
                            style={{
                                width: '40px',
                                height: '40px',
                                objectFit: 'cover',
                            }}
                        />
                        <div className="direct-chat-text">
                            Is this template really for free? That's unbelievable!
                        </div>
                    </div>
                    <div className="direct-chat-msg right">
                        <div className="direct-chat-infos clearfix">
                            <span className="direct-chat-name float-right">Sarah Bullock</span>
                            <span className="direct-chat-timestamp float-left">23 Jan 2:05 pm</span>
                        </div>
                        <Image
                            className="direct-chat-img"
                            src="https://images5.alphacoders.com/131/1310740.png"
                            alt="Foto Admin"
                            style={{
                                width: '40px',
                                height: '40px',
                                objectFit: 'cover',
                            }}
                        />
                        <div className="direct-chat-text">
                            You better believe it!
                        </div>
                    </div>
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
};

Chat.defaultProps = {
    titleChat: 'Direct Chats',
};

export default Chat;
