import React, { useEffect, useRef } from "react";

import Image from "../../../components/Image";
import Video from "../../../components/Video";

import fireBaseTime from "../../../Helper/fireBaseTime";
import { checkfileUrl } from "../../../Helper/checkFile";

const MessagesComponents = ({
    id, text, date,
    senderId, currentUID, currentDisplayName, userDisplayName,
    currentPhotoURL,
    userPhotoURL, img,
}) => {
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div
        ref={ref}
        className={`direct-chat-msg ${senderId === currentUID && "right"} my-4`}
        style={{
            display: "flex",
            flexDirection: "column",
            alignItems: senderId === currentUID ? "flex-end" : "flex-start",
        }}
    >
        <div className="direct-chat-infos clearfix">
            <span
                className={`direct-chat-name ${
                    senderId === currentUID ? "float-right" : "float-left"
                }`}
            >
                {senderId === currentUID ? currentDisplayName : userDisplayName}
            </span>
        </div>
        <div
            className={`d-flex ${senderId === currentUID && "flex-row-reverse"}`}
        >
            <Image
                className="direct-chat-img"
                src={senderId === currentUID ? currentPhotoURL : userPhotoURL}
                alt={senderId === currentUID ? "Foto Pengguna" : "Foto Admin"}
                style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "cover",
                }}
            />
            <div className="d-flex flex-column">
                {img && (
                    <div
                        className="m-2"
                        style={{
                            float: senderId === currentUID ? "right" : "left",
                        }}
                    >
                    {checkfileUrl(img) ? (
                        <Image
                            className="my-2"
                            src={img}
                            alt={`messages-images-${id}`}
                            style={{
                                width: "350px",
                                objectFit: "cover",
                            }}
                        />
                    ) : (
                        <Video
                            className="my-2"
                            src={img}
                            style={{
                                objectFit: "cover",
                                width: "350px",
                            }}
                        />
                    )}
                    </div>
                )}
                {
                    text !== "" && (
                        <div
                            className="direct-chat-text my-2"
                            style={{
                                float: senderId === currentUID ? "right" : "left",
                                margin: "0 15px",
                                wordBreak: "keep-all",
                            }}
                        >
                            {text}
                        </div>
                    )
                }
            </div>
        </div>
        <span
            className={`direct-chat-timestamp ${
                senderId === currentUID ? "float-right" : "float-left"
            }`}
        >
            {`${fireBaseTime(date).toDateString().toString("MMMM yyyy")} - ${fireBaseTime(date).toLocaleTimeString()}`}
        </span>
    </div>
  );
};

MessagesComponents.propTypes = {};

MessagesComponents.defaultProps = {};

export default MessagesComponents;
