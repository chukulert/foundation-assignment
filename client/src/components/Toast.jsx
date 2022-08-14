import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const AppToast = (props) => {
  const { showToast, setShowToast, toastMsg } = props;

  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3500}
        autohide
      >
        <Toast.Body>{toastMsg}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default AppToast;
