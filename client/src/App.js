import React, { useContext } from "react";
import UserManagement from "./pages/UserManagement";
import Protected from "./components/Protected";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { Navigate, useLocation } from "react-router-dom";
import GroupManagement from "./pages/GroupManagement";
import NavBar from "./components/NavBar";

const App = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/login" && <NavBar />}
      <Routes>
        <Route
          path="/"
          element={
            <Protected>
              <Home />
            </Protected>
          }
        />
        <Route
          path="/user-management"
          element={
            <Protected admin>
              <UserManagement />
            </Protected>
          }
        />
        <Route
          path="/group-management"
          element={
            <Protected admin>
              <GroupManagement />
            </Protected>
          }
        />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
