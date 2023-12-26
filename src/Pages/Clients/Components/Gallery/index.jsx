import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { ChatContext } from "../../../../Context/ChatContext";

import { db } from "../../../../firebase";

import Loading from "../../../../Components/Loading";
import GalleryComponents from "./Components/GalleryComponents";

const Gallery = () => {
    const [fileData, setFileData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { data: { chatId } } = useContext(ChatContext);

    useEffect(() => {
        setIsLoading(true);

        const unSub = onSnapshot(doc(db, "chats", chatId), (doc) => {
            if (doc.exists()) {
                const messagesData = doc.data().messages;
                const findFileData = messagesData.filter(({ img }) => img).map(({ img }) => img);
                setFileData(findFileData);
            }

            setIsLoading(false);
        });

        return () => { unSub(); };
    }, [chatId]);

    return (
        <div style={{ height: "450px", overflow: 'auto', padding: '8px' }}>
            {
                isLoading ? (
                    <div className="overlay position-relative">
                        <Loading />
                    </div>
                ) : (
                    <GalleryComponents data={fileData} />
                )
            }
        </div>
    );
};

export default Gallery;
