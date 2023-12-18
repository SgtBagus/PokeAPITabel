import React, { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { NotificationContainer } from "react-notifications";

import { AuthContextProvider } from "./Context/AuthContext";

import "react-notifications/lib/notifications.css";

import Routes from "./Routes/Routes";

function App() {
  return (
    <AuthContextProvider>
      <StrictMode>
        <BrowserRouter basename="/">
          <Routes />

          <NotificationContainer />
        </BrowserRouter>
      </StrictMode>
    </AuthContextProvider>
  );
}

export default App;
