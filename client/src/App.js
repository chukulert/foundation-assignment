import React, { useContext } from "react";
import UserManagement from "./pages/UserManagement";
import Protected from "./components/Protected";
import useAuth from "./hooks/useAuth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AuthProvider, { AuthContext } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

const App = () => {
const [user] = useAuth()
console.log(user)
  
  // console.log(user)

  return (
    <AuthProvider>
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Protected user={user} ><Home /></Protected>} />
        <Route path="/user-management" element={<Protected user={user} admin><UserManagement /></Protected>} />
        <Route path="login" element={<Login />} />
        <Route
          path="*"
          element={<Navigate to="/" replace />}
      />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
};

export default App;
