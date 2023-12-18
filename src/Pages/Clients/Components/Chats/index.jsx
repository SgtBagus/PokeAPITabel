import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { ChatContext } from "../../../../Context/ChatContext";

import { db } from "../../../../firebase";

import MessagesComponents from "./Components/MessagesComponents";
import Loading from "../../../../Components/Loading";
import FormComponents from "./Components/FormComponents";

const Chat = ({ titleChat }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {
    data: { chatId },
  } = useContext(ChatContext);

  useEffect(() => {
    setIsLoading(true);
    const unSub = onSnapshot(doc(db, "chats", chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);

      setIsLoading(false);
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  return (
    <div className="row">
      <div className="col-md-12">
        {isLoading ? (
          <div className="overlay" style={{ height: "450px" }}>
            <Loading />
          </div>
        ) : (
          <div className="row">
            <div className="col-md-12">
              <div className="direct-chat-messages" style={{ height: "450px" }}>
                {messages.map((m) => (
                  <MessagesComponents message={m} key={m.id} />
                ))}
              </div>
            </div>
            <div className="col-md-12">
              <FormComponents />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
