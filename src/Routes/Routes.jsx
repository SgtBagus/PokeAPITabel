import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { LayoutDefault } from "../Layout"; 

import Home from "../Pages/Dashboard";

import Login from "../Pages/Login/";
import ForgotPassword from "../Pages/Login/ForgotPassword";

import { NotFound404 } from "../Layout/404";

import { AuthContext } from "../Context/AuthContext";
import { ChatContextProvider } from '../Context/ChatContext';

import ReveralCode from "../Pages/ReveralCode/";
import EditFormReveralCode from "../Pages/ReveralCode/Components/EditFormReveralCode";

import UsersTodo from "../Pages/UsersTodo/";
import Client from "../Pages/Clients";
import TodoLists from "../Pages/TodoLists";

const RenderDefaultLayout = (page, pageName, currentUser, path) => (
  <LayoutDefault
    dataLogin={currentUser}
    pageName={pageName}
    path={path}
  >
    {page}
  </LayoutDefault>
)

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
      <Route path="client">
        <Route
          index
          element={
            <ProtectedRoute>
              {
                RenderDefaultLayout(
                  <ChatContextProvider>
                    <Client />
                  </ChatContextProvider>,
                  "Client", currentUser, "/client"
                )
              }
            </ProtectedRoute>
          }
        />
        <Route
          path="to-do/:type/:docsId"
          element={
            <ProtectedRoute>
              {RenderDefaultLayout(<TodoLists />, "Todo Client", currentUser, "/client" )}
            </ProtectedRoute>
          }
        />
        <Route
          path="to-do/:type/:docsId/:id"
          element={
            <ProtectedRoute>
              {RenderDefaultLayout(<TodoLists />, "Todo Client", currentUser, "/client" )}
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="reveral-code" element={
        <ProtectedRoute>
          {RenderDefaultLayout(<ReveralCode dataLogin={currentUser} />, "Reveral Code", currentUser, "/reveral-code" )}
        </ProtectedRoute>
        }
      />
      <Route path="reveral-code/:id" element={
        <ProtectedRoute>
          {RenderDefaultLayout(<EditFormReveralCode />, "Reveral Code Edit", currentUser, "/reveral-code" )}
        </ProtectedRoute>
        }
      />

      <Route path="users-todo" element={
        <ProtectedRoute>
          {RenderDefaultLayout(<UsersTodo />, "Users Todo", currentUser, "/users-todo" )}
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
