import React from "react";
import {  useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import AppRoutes from "./components/AppRoutes";


const App = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/login" && <NavBar />}
      <AppRoutes />
    </>
  );
};

export default App;
