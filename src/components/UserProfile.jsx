import React, { useState } from 'react'
import PropTypes from 'prop-types';

import Image from './Image';
import ButtonComponents from './Button';

const UserProfile = ({
    data: {
        displayName, email, photoURL, uid,
    },
    chatId, userDesc, allowChat, changeStatusMessage,
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const changeAllowMessage = async () => {
        setIsLoading(true);

        await changeStatusMessage(!allowChat, chatId);

        setIsLoading(false);
    }

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
                            <ButtonComponents
                                type="button"
                                label={isLoading ? 'Memperoses' : allowChat ? "Non Aktifkan Percakapan !" : 'Aktifkan Percakapan !'}
                                className={`btn btn-${!allowChat ? 'primary' : 'danger' } btn-sm`}
                                buttonIcon={isLoading && 'fas fa-sync-alt fa-spin'}
                                onClick={() => { this.changeAllowMessage(); }}
                                disabled={isLoading}
                            />
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
    changeStatusMessage: PropTypes.func.isRequired,
};

UserProfile.defaultProps = {
    allowChat: false,
    chatId: '',
    data: {
        displayName: 'Display name',
        email: 'email@gmail.com ',
        photoURL: null,
        uid: null,
    },
};

export default UserProfile;
