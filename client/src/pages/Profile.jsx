import Container from "react-bootstrap/Container";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Table from "react-bootstrap/Table";
import EditPersonalForm from "../components/EditPersonalForm";
import * as api from "../api/index";
import Button from "react-bootstrap/Button";
import AppModal from "../components/AppModal";
import { ToastContext } from "../context/ToastContext";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const { setToastMsg, setShowToast } = useContext(ToastContext);

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
            <h1>Profile</h1>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
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

      <AppModal
        showModal={showModal}
        handleShowModal={handleShowModal}
        title={modalType === "email" ? "Change Email" : "Change Password"}
      >
        <EditPersonalForm
          user={user}
          modalType={modalType}
          updatePersonalDetails={updatePersonalDetails}
        />
      </AppModal>
    </>
  );
};

export default Profile;
