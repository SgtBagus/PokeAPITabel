import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { NotificationContainer } from 'react-notifications';

import { LayoutDefault } from "../Layout"; 

import Home from "../Pages/Dashboard";

import Login from "../Pages/Login/";
import ForgotPassword from "../Pages/Login/ForgotPassword";

import { NotFound404 } from "../Layout/404";

import { AuthContext } from "../Context/AuthContext";


const RenderDefaultLayout = (page, pageName, currentUser, path) => {
  return (
    <LayoutDefault dataLogin={currentUser} pageName={pageName} path={path}>
      {page}

      <NotificationContainer />
    </LayoutDefault>
  )
}

const App = () => {
  const { currentUser, isLoading } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {

    if (!isLoading) {
      if (!currentUser) {
        return <Navigate to="/login" />;
      }
    }

    return children;
  };

  const HasRoute = ({ children }) => {
    if (!isLoading) {
      if (currentUser) {
        return <Navigate to="/" />;
      }
    }

    return children;
  };

  return (
    <Routes>
      <Route path="" element={
          <ProtectedRoute>
            {RenderDefaultLayout(<Home dataLogin={currentUser} />, "Home", currentUser, "/" )}
          </ProtectedRoute>
        }
      />

      <Route path="login" element={
          <HasRoute>
            <Login />
          </HasRoute>
      } />
      <Route path="lupa-password" element={
        <HasRoute>
          <ForgotPassword />
        </HasRoute>
      } />

      <Route path="*" element={<NotFound404 />} />
    </Routes>
  );
}

export default App;
