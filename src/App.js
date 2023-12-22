import React, { Fragment } from "react";
import { BrowserRouter } from "react-router-dom";
import { NotificationContainer } from "react-notifications";

import { AuthContextProvider } from "./Context/AuthContext";

import "react-notifications/lib/notifications.css";

import Routes from "./Routes/Routes";

function App() {
  return (
    <AuthContextProvider>
      <Fragment>
        <BrowserRouter basename="/">
          <Routes />

          <NotificationContainer />
        </BrowserRouter>
      </Fragment>
    </AuthContextProvider>
  );
}

export default App;
