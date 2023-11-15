import React from 'react'
import PropTypes from 'prop-types';

import Image from '../../../components/Image';
import Card from '../../../components/Card';
import Loading from '../../../components/Loading';

import fireBaseTime from '../../../Helper/fireBaseTime';

import './style.scss';

const UserChats = ({
    isLoading, titleChat, data, userClickHandel,
}) => {
    return (
        <Card
            title={titleChat}
            type="card-primary"
            height="660px"
        >
            {
                isLoading ? (
                    <Loading
                        title="Memuat..."
                    />
                )
                : (
                    <ul className='nav nav-pills nav-sidebar flex-column chats-user-container'>
                        {
                            Object.entries(data)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => {
                                const chatId = chat[0];
                                const {
                                    userInfo: {
                                        photoURL,
                                        displayName,
                                        uid,
                                    },
                                    date,
                                    lastMessage,
                                } = chat[1]

                                return (
                                    <li
                                        className='nav-item'
                                        key={chatId}
                                        onClick={() => userClickHandel(chatId, uid)}
                                    >
                                        <div className="nav-link chats-user-list">
                                            <div className="user-block" style={{ float: 'unset' }}>
                                                <Image
                                                    className="img-circle img-bordered-sm"
                                                    src={photoURL}
                                                    alt={`User Photo - ${uid}`}
                                                />
                                                <span className="username">
                                                    {displayName}
                                                </span>
                                                <span className="description">
                                                    {lastMessage ? lastMessage.text : 'Pengguna Baru'}
                                                    <br />
                                                    {
                                                        `${fireBaseTime(date).toDateString().toString("MMMM yyyy")}
                                                        -
                                                        ${fireBaseTime(date).toLocaleTimeString()}`
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                )
            }
        </Card>
    )
}


UserChats.propTypes = {
    titleChat: PropTypes.string,
    isLoading: PropTypes.bool,
    userClickHandel: PropTypes.func.isRequired,
    data: PropTypes.shape({}),
};

UserChats.defaultProps = {
    isLoading: true,
    data: null,
    titleChat: 'Direct Chats',
};

export default UserChats;
