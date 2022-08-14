import React from "react";
import UserManagement from "../pages/UserManagement";
import Protected from "./Protected";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import { Navigate } from "react-router-dom";
import GroupManagement from "../pages/GroupManagement";

const AppRoutes = () => {

  return (
    <>
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
          path="/profile"
          element={
            <Protected>
              <Profile />
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

export default AppRoutes;
