import React, { Fragment } from "react";
import { BrowserRouter } from "react-router-dom";
import { NotificationContainer } from "react-notifications";

import "react-notifications/lib/notifications.css";

import Routes from "./Routes/Routes";

function App() {
  return (
    <Fragment>
      <BrowserRouter basename="/">
        <Routes />

        <NotificationContainer />
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
