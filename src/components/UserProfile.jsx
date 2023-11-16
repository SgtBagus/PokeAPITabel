import React from 'react'
import PropTypes from 'prop-types';
import { NotificationManager } from 'react-notifications';

import Image from './Image';
import { changeAllowChatHandel } from '../Data/Chats';

import { catchError } from '../Helper/helper';

const changeStatusMessage = async (value, chatId) => {
    try {
        await changeAllowChatHandel('chats', chatId, {
            allow_chat: value,
        });
    } catch(err) {
        NotificationManager.error(catchError(err), 'Terjadi Kesalahan', 5000);
    }
}

const UserProfile = ({
    data: {
        displayName, email, photoURL, uid,
    },
    chatId,
    userDesc,
    allowChat,
}) => {
    return (
        <div className="card card-widget widget-user-2">
            <div className="widget-user-header bg-info d-flex align-items-center">
                <Image
                    className="img-circle img-bordered-sm mx-2"
                    src={photoURL}
                    alt={`User Profile - ${uid}`}
                    style={{ height: '85px', width: '85px', objectFit: 'cover' }}
                />
                <div className="mx-2">
                    <h3 className="widget-user-username m-0 my-1">{displayName}</h3>
                    <h5 className="widget-user-desc m-0 my-1">{email}</h5>

                    <div className="my-2">
                        <div className="btn-group">
                            <button type="button" className="btn btn-default btn-sm" data-toggle="collapse" href="#descUser">
                                Detail pengguna
                            </button>
                            <button
                                type="button"
                                className={`btn btn-${!allowChat ? 'primary' : 'danger' } btn-sm`}
                                onClick={() => changeStatusMessage(!allowChat, chatId)}
                            >
                                {
                                    allowChat ? "Non Aktifkan Percakapan !" : 'Aktifkan Percakapan !'
                                }
                                Aktifkan Percakapan !
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-footer p-0">
                <div id="descUser" className="collapse" data-parent="#descUser">
                    <div className="card-body">
                        {userDesc}
                    </div>
                </div>
            </div>
        </div>
    )
}

UserProfile.propTypes = {
    allowChat: PropTypes.bool,
    chatId: PropTypes.string,
    data: PropTypes.shape({
      displayName: PropTypes.string,
      email: PropTypes.string,
      photoURL: PropTypes.string,
      uid: PropTypes.string,
    }),
};

UserProfile.defaultProps = {
    allowChat: false,
    chatId: '',
    data: {
        displayName: 'Display name',
        email: 'email@gmail.com ',
        photoURL: null,
        uid: null,
    }
};

export default UserProfile;
