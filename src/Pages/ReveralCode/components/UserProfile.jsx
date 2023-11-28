import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { NotificationManager } from "react-notifications";
import { doc, onSnapshot } from "firebase/firestore";

import { db } from "../../../firebase";

import Loading from "../../../components/Loading";

import defaultImage from "./defaultImage.png";

const UserProfile = ({
    selectedUid
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const [dataUser, setDataUser] = useState({
        displayName: 'Username',
        photoURL: defaultImage,
        email: 'useremail@gmail.com',
    });

    useEffect(() => {
        setIsLoading(true);

        if (selectedUid) {
            const unSub = onSnapshot(doc(db, "users", selectedUid), async (doc) => {
                if (doc.exists()) {
                    await setDataUser(doc.data());
                    setIsLoading(false);
                } else {
                    NotificationManager.error('Gagal Mengambil Data Pengguna', "Terjadi Kesalahan", 5000);
                }
            });

            return () => { unSub() };
        }
    }, [selectedUid]);
    
    const { displayName, photoURL, email } = dataUser;

    return (
        <>
            {
                isLoading ? (
                    <Loading title="Memuat..." />
                ) : (
                    <div className="d-flex">
                        <img src={photoURL} alt="User Revelar Code Handel" className="rounded-circle" style={{ width: '50px', height: '50px', objectFit: 'cover' }}/>
                        <div className="d-flex flex-column ml-3">
                            <div className="users-list-name">{displayName}</div>
                            <span className="users-list-date">{email}</span>
                        </div>
                    </div>
                )
            }
        </>
    )
}

UserProfile.propTypes = {
    selectedUid: PropTypes.string.isRequired
};


export default UserProfile;
