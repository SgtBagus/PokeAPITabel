import {
  createContext, useContext, useReducer,
} from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const INITIAL_STATE = {
    chatId: 'null',
    user: {
      date: null,
      lastMessage: null,
      userInfo: {
        uid: null,
        displayName: null,
        photoURL: null,
      },
    },
  };

  const chatReducer = (state, action) => {
    const { type, payload } = action;
    const { userInfo: { uid: selectedUid } } = payload;

    switch (type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            currentUser.uid > selectedUid
            ? currentUser.uid + selectedUid
            : selectedUid + currentUser.uid,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data:state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
