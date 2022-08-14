import Modal from "react-bootstrap/Modal";

const AppModal = (props) => {
  const { children, showModal, handleShowModal, title } = props;

  return (
    <Modal show={showModal} onHide={handleShowModal}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      {children}
    </Modal>
  );
};

export default AppModal;
