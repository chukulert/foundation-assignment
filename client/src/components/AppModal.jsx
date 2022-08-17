import { useContext } from "react";
import Modal from "react-bootstrap/Modal";
import { ModalContext } from "../context/ModalContext";

const AppModal = (props) => {
  const { children, handleShowModal, showModal, title } = props;

  return (
    <Modal show={showModal} onHide={handleShowModal} >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      {children}
    </Modal>
  );
};

export default AppModal;
