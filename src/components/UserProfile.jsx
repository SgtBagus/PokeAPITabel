import React from 'react'
import PropTypes from 'prop-types';

import Image from './Image';

const UserProfile = ({
    data, userRole, userDesc, allowChat, chatLength, fileLength,
}) => {
    const { displayName, email, photoURL, uid } = data;

    return (
        <div className="card card-widget widget-user">
            <div className="widget-user-header bg-info">
                <h3 className="widget-user-username">{displayName}</h3>
                <h5 className="widget-user-desc">{email} - {userRole}</h5>
            </div>
            <div className="widget-user-image">
                <Image
                    className="img-circle elevation-2"
                    src={photoURL}
                    alt={`User Profile - ${uid}`}
                    style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                    }}
                />
            </div>
            <div className="card-footer" style={{ paddingTop: '40px' }}>
                <div className="row my-3 text-center">
                    <div className="col-sm-12">
                        {userDesc}
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6 border-right">
                        <div className="description-block">
                            <h5 className="description-header">{chatLength}</h5>
                            <span className="description-text">Percakapan</span>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="description-block">
                            <h5 className="description-header">{fileLength}</h5>
                            <span className="description-text">Total File</span>
                        </div>
                    </div>
                </div>
            </div>
      </div>
    )
}

UserProfile.propTypes = {
    userRole: PropTypes.string,
    allowChat: PropTypes.bool,
    data: PropTypes.shape({
      displayName: PropTypes.string,
      email: PropTypes.string,
      photoURL: PropTypes.string,
      uid: PropTypes.string,
    }),
};

UserProfile.defaultProps = {
    userRole: 'Pengguna',
    allowChat: false,
    data: {
        displayName: 'Display name',
        email: 'email@gmail.com ',
        photoURL: null,
        uid: null,
    }
};

export default UserProfile;
