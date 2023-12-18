import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { ChatContext } from "../../../../Context/ChatContext";

import { db } from "../../../../firebase";

import EmptyGallery from "./Components/EmptyGallery";

import Image from "../../../../Components/Image";
import Video from "../../../../Components/Video";
import Loading from "../../../../Components/Loading";

import { checkFileUrlName, checkfileUrl } from "../../../../Helper/checkFile";

const Gallery = () => {
    const [fileData, setFileData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const {
        data: { chatId },
    } = useContext(ChatContext);

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
        <>
            {
                isLoading ? (
                    <div className="overlay position-relative" style={{ height: "450px" }}>
                        <Loading />
                    </div>
                ) : (
                    <div className="d-flex flex-wrap" style={{ height: "450px", overflow: 'auto' }}>
                        {
                            fileData.length > 0
                            ? (
                                <>
                                    {
                                        fileData.map((x, idx) => (
                                            <div className="d-flex flex-column align-items-center m-2" key={idx}>
                                                {checkfileUrl(x) ? (
                                                    <Image
                                                        className="my-2"
                                                        src={x}
                                                        alt={`messages-gallery-${idx}`}
                                                        style={{
                                                            width: "280px",
                                                            objectFit: "cover",
                                                            borderRadius: "25px",
                                                        }}
                                                    />
                                                ) : (
                                                    <Video
                                                        className="my-2"
                                                        src={x}
                                                        style={{
                                                            objectFit: "cover",
                                                            width: "280px",
                                                            borderRadius: "25px",
                                                        }}
                                                    />
                                                )}
                                                <span
                                                    style={{
                                                        width: "280px",
                                                        wordBreak: "break-all",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {checkFileUrlName(x)}
                                                </span>
                                            </div>
                                        ))
                                    }
                                </>
                            )
                            : (
                                <EmptyGallery />
                            )
                        }
                    </div>
                )
            }
        </>
    );
};

export default Gallery;
