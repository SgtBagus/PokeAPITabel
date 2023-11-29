import { createContext, useReducer } from "react";

export const ButtonContext = createContext();

export const ButtonContextProvider = ({ children }) => {
    const INITIAL_STATE = null;

    const buttonReducer = (state, action) => {
        const { dataButtonList, typeSwtich } = action;
    
        switch (typeSwtich) {
            case "CHANGE_BUTTON":
                const buttonMaping = dataButtonList.map(({
                    id, type, className, onClick, buttonText, iconButton, customButton = null,
                }) => ({
                    id, type, className, onClick, buttonText, iconButton, customButton,
                }))

                return buttonMaping;
            default:
                return state;
        }
    };
    
    const [state, dispatch] = useReducer(buttonReducer, INITIAL_STATE);

    return (
        <ButtonContext.Provider value={{ dataButtonList:state, dispatch }}>
            {children}
        </ButtonContext.Provider>
    );
};
