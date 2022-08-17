import { useEffect, useState } from "react";
import * as api from "../api/index";
import UserTable from "../components/UserTable/UserTable";
import EditUserForm from "../components/EditUserForm";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import PasswordResetForm from "../components/PasswordResetForm";
import AppModal from "../components/AppModal";
import { useContext } from "react";
import { ToastContext } from "../context/ToastContext";

const UserManagement = () => {
  const [allUserData, setAllUserData] = useState([]);
  const [allGroupsData, setAllGroupsData] = useState([]);

  const [targetUser, setTargetUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const { setToastMsg, setShowToast } = useContext(ToastContext);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      await Promise.all([fetchAllUsersData(), fetchAllGroupsData()]);
    };
    fetchData();

    return () => {
      controller.abort();
    };
  }, []);

  const fetchAllUsersData = async () => {
    const { data } = await api.getAllUsers();
    setAllUserData(data);
  };
  
  const fetchAllGroupsData = async () => {
    const { data } = await api.getAllGroups();
    setAllGroupsData(data);
  };

  const handleShowModal = (clickedUser, modalType) => {
    clickedUser ? setTargetUser(clickedUser) : setTargetUser(null);
    showModal ? setShowModal(false) : setShowModal(true);
    setModalType(modalType);
  };

  const handleResetPasswordModal = (clickedUser) => {
    showPasswordModal ? setTargetUser(null) : setTargetUser(clickedUser);
    showPasswordModal
      ? setShowPasswordModal(false)
      : setShowPasswordModal(true);
  };

  const handleNewUser = () => {
    handleShowModal(null, "new");
  };

  const submitEditUser = async (data) => {
    console.log(data);
    try {
      await api.updateUser(data);
      await fetchAllUsersData();
      setTargetUser(null);
      setShowModal(false);
      setToastMsg(`Account "${data.username}" updated successfully`);
    } catch (error) {
      setToastMsg(error.response.data.message);
    }
    setShowToast(true);
  };

  const submitNewUser = async (data) => {
    console.log(data);
    try {
      await api.createUser(data);
      await fetchAllUsersData();
      setTargetUser(null);
      setToastMsg(`Account "${data.username}" created successfully`);
    } catch (error) {
      setToastMsg(error.response.data.message);
    }
    setShowToast(true);
  };

  const submitResetPassword = async (password) => {
    const data = {
      username: targetUser.username,
      password,
    };
    try {
      await api.updatePassword(data);
      handleResetPasswordModal();
      setToastMsg("Password updated successfully");
    } catch (error) {
      setToastMsg(error.response.data.message);
    }
    setShowToast(true);
  };

  return (
    <>
      <Container>
        <div className="d-flex justify-content-between mb-3 mt-3">
          <h1>User Management</h1>
          <Button variant="success" onClick={handleNewUser}>
            New User
          </Button>
        </div>
        <UserTable
          allUserData={allUserData}
          handleEditModal={handleShowModal}
          handleResetPasswordModal={handleResetPasswordModal}
        />

        <AppModal
          showModal={showModal}
          handleShowModal={handleShowModal}
          modalType={modalType}
          title={modalType === "edit" ? "Edit User" : "New User"}
        >
          <EditUserForm
            user={targetUser}
            allGroupsData={allGroupsData}
            submitEditUser={submitEditUser}
            submitNewUser={submitNewUser}
            modalType={modalType}
          />
        </AppModal>

        <AppModal
          showModal={showPasswordModal}
          handleShowModal={handleResetPasswordModal}
          title="Reset Password"
        >
          <PasswordResetForm
            user={targetUser}
            submitResetPassword={submitResetPassword}
          />
        </AppModal>
      </Container>
    </>
  );
};

export default UserManagement;
