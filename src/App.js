import React from "react";
import { HashRouter } from "react-router-dom";

import { AuthContextProvider } from "./Context/AuthContext";

import Routes from './Routes/Routes';

function App() {
  return (
    <AuthContextProvider>
      <React.StrictMode>
        <HashRouter>
          <Routes />
        </HashRouter>
      </React.StrictMode>
    </AuthContextProvider>
  );
}

export default App;
