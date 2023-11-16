import React from "react";
import { HashRouter } from "react-router-dom";
import { NotificationContainer } from 'react-notifications';

import { AuthContextProvider } from "./context/AuthContext";


import 'react-notifications/lib/notifications.css';

import Routes from './Routes/Routes';

function App() {
  return (
    <AuthContextProvider>
      <React.StrictMode>
        <HashRouter>
          <Routes />

          <NotificationContainer />
        </HashRouter>
      </React.StrictMode>
    </AuthContextProvider>
  );
}

export default App;
