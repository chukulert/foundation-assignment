import { createContext, useState } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import AppModal from "../components/AppModal";

export const ToastContext = createContext();

const ToastProvider = (props) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  return (
    <ToastContext.Provider
      value={{ showToast, setShowToast, toastMsg, setToastMsg }}
    >
      {props.children}
      <ToastContainer position="top-end" className="p-3" containerPosition="fixed">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3500}
          autohide
        >
          <Toast.Body>{toastMsg}</Toast.Body>
        </Toast>
      </ToastContainer>
    </ToastContext.Provider>
 
  );
};

export default ToastProvider;
