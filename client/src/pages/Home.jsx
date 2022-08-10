import Container from "react-bootstrap/Container";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Table from "react-bootstrap/Table";
import EditPersonalForm from "../components/EditPersonalForm";
import * as api from "../api/index";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const Home = () => {
  const { user, setUser } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [toastMsg, setToastMsg] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const handleShowModal = (modalType) => {
    modalType ? setModalType(modalType) : setModalType(null);
    showModal ? setShowModal(false) : setShowModal(true);
  };

  const updatePersonalDetails = async (data) => {
    try {
      await api.updateMe(data);
      const updatedUser = await api.getMe();

      setUser({
        token: user.token,
        ...updatedUser.data,
      });
      handleShowModal();
      setToastMsg("Details updated successfully.");
    } catch (error) {
      setToastMsg(error.response.data.message);
    }
    setShowToast(true);
  };

  return (
    <>
      <Container>
        {user && (
          <>
            <h1>Home</h1>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <Button
                      onClick={() => handleShowModal("email")}
                      variant="primary"
                    >
                      Email
                    </Button>
                    <Button
                      onClick={() => handleShowModal("password")}
                      variant="secondary"
                    >
                      Password
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </>
        )}
      </Container>

      <Modal show={showModal} onHide={handleShowModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Change {modalType === "password" ? "Password" : "Email"}
          </Modal.Title>
        </Modal.Header>
        <EditPersonalForm
          user={user}
          modalType={modalType}
          updatePersonalDetails={updatePersonalDetails}
        />
      </Modal>

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
    </>
  );
};

export default Home;
