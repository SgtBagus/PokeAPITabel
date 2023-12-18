import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { ChatContext } from "../../../../Context/ChatContext";

import { db } from "../../../../firebase";

import MessagesComponents from "./Components/MessagesComponents";
import Loading from "../../../../Components/Loading";
import FormComponents from "./Components/FormComponents";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: { chatId } } = useContext(ChatContext);

  useEffect(() => {
    setIsLoading(true);
  
    if (chatId) {
      const unSub = onSnapshot(doc(db, "chats", chatId), (doc) => {
        doc.exists() && setMessages(doc.data().messages);
  
        setIsLoading(false);
      });

      return () => { unSub() };
    }
  }, [chatId]);

  return (
    <>
        {isLoading ? (
          <div className="overlay position-relative" style={{ height: "400px" }}>
            <Loading />
          </div>
        ) : (
          <>
              <div className="direct-chat-messages" style={{ height: "400px" }}>
                {messages.map((m) => (
                  <MessagesComponents message={m} key={m.id} />
                ))}
              </div>
              <FormComponents />
          </>
        )}
    </>
  );
};

export default Chat;
