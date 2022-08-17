import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthProvider from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import ToastProvider from "./context/ToastContext";
import ModalProvider from "./context/ModalContext";
import ApplicationProvider from "./context/ApplicationContext";
import './index.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <ToastProvider>
      <ModalProvider>
        <ApplicationProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ApplicationProvider>
      </ModalProvider>
    </ToastProvider>
  </AuthProvider>
);
