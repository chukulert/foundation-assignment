import { useEffect, useState } from "react";
import * as api from "../api/index";
import UserTable from "../components/UserTable/UserTable";
import Modal from 'react-bootstrap/Modal';
import EditUserForm from "../components/EditUserForm";
import Button from "react-bootstrap/esm/Button";
import useAuth from "../hooks/useAuth";
import { capitalizeFirstLetter } from "../utils/helpers";

const UserManagement = ({user}) => {
  const [allUserData, setAllUserData] = useState([]);
  const [allGroupsData, setAllGroupsData] = useState([])
  const [targetUser, setTargetUser] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)


  const handleEditModal = (clickedUser) => {
    // showEditModal ? setShowEditModal(false) : setShowEditModal(true)
    console.log(clickedUser)
    setTargetUser(clickedUser)
  }

  //modal for new user form
  //modal for editting each user

  useEffect(() => {
    const getUserData = async () => {
      const { data } = await api.getAllUsers();
      setAllUserData(data);
    };
    const getAllGroupsData = async() => {
      const { data } = await api.getAllGroups();

      setAllGroupsData(data)
    }
    getUserData();
    getAllGroupsData()
  }, []);

  return (
    <>
      <h1>User Management</h1>
      <UserTable allUserData={allUserData} handleEditModal={handleEditModal} setTargetUser={setTargetUser} />

      <EditUserForm user={targetUser} allGroupsData={allGroupsData}/>

      <Modal show={showEditModal} onHide={handleEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <EditUserForm  user={targetUser} optionsArray={allGroupsData}/>
      </Modal>
    </>
  );
};

export default UserManagement;
