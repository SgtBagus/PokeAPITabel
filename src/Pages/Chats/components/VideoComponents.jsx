import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { ChatContext } from "../../../context/ChatContext";

import { db } from "../../../firebase";

import Loading from "../../../components/Loading";
import Image from "../../../components/Image";
import Video from "../../../components/Video";
import Card from "../../../components/Card";

import EmptyGallery from "./EmptyGallery";

import { checkFileUrlName, checkfileUrl } from "../../../Helper/checkFile";

const VideoComponents = () => {
    const [fileData, setFileData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { data: { chatId, user: { userInfo: { displayName } } } } = useContext(ChatContext);

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

        return () => {
            unSub();
        };
    }, [chatId]);

    return (
        <>
            {
                chatId !== "null" ? (
                    <Card
                        title={`Video Gallery - ${displayName}`}
                        type="card-primary"
                        height="500px"
                    >
                        {
                            isLoading ? (
                                <div className="container h-100">
                                    <div className="d-flex flex-column align-items-center justify-content-center h-100">
                                        <Loading title="Memuat..." />
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex flex-wrap">
                                    {
                                        fileData.map((x, idx) => (
                                            <div className="d-flex flex-column align-items-center m-2">
                                                {
                                                    checkfileUrl(x) ? (
                                                        <Image
                                                            className="my-2"
                                                            src={x}
                                                            alt={`messages-gallery-${idx}`}
                                                            style={{
                                                                width: "280px",
                                                                objectFit: "cover",
                                                                borderRadius: '25px',
                                                            }}
                                                        />
                                                    ) : (
                                                        <Video
                                                            className="my-2"
                                                            src={x}
                                                            style={{
                                                                objectFit: "cover",
                                                                width: "280px",
                                                                borderRadius: '25px',
                                                            }}
                                                        />
                                                    )
                                                }
                                                <span style={{ width: '280px', wordBreak: 'break-all', textAlign: "center"}}>
                                                    {checkFileUrlName(x)}
                                                </span>
                                            </div>
                                        ))
                                    }
                                </div>
                            )
                        }
                    </Card>
                ) : (
                    <EmptyGallery />
                )
            }
        </>
    );
};

export default VideoComponents;
