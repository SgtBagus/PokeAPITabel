import { createContext, useReducer } from "react";

export const LoadingContext = createContext();

export const LoadingContextProvider = ({ children }) => {

  const changeLoading = (isLoading, action) => {
    if (action) {
        document.querySelector("body").classList.add("hold-transition");
    } else {
        document.querySelector("body").classList.remove("hold-transition");
    }

    return action;
  };

  const [isLoading, dispatchLoading] = useReducer(changeLoading, true);

  return (
    <LoadingContext.Provider value={{ isLoading, dispatchLoading }}>
        <div
            className="preloader flex-column justify-content-center align-items-center"
            style={isLoading ? {} : { height: '0px'}}
        >
            <img
                className="animation__shake"
                src="https://cdn-icons-png.flaticon.com/512/5360/5360938.png"
                alt="AdminLTELogo"
                height="60"
                width="60"
                style={isLoading ? {} : { display: 'none'}}
            />
        </div>
        {children}
    </LoadingContext.Provider>
  );
};
