import { createContext, useState } from "react";

export const ModalContext = createContext();

const ModalProvider = (props) => {
  const [modalTitle, setModalTitle] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    showModal ? setShowModal(false) : setShowModal(true);
  };

  return (
    <ModalContext.Provider
      value={{ setModalTitle, handleShowModal, showModal, setShowModal, modalTitle }}
    >
      {props.children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
