import { useState, useEffect, useContext } from "react";
import Container from "react-bootstrap/Container";
import * as api from "../api/index";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { ToastContext } from "../context/ToastContext";
import AppModal from "../components/AppModal";
import NewGroupForm from "../components/NewGroupForm";
import { capitalizeFirstLetter } from "../utils/helpers";

const GroupManagement = () => {
  const [allGroupsData, setAllGroupsData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const { setShowToast, setToastMsg } = useContext(ToastContext);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAllGroupsData = async () => {
      const { data } = await api.getAllGroups();
      setAllGroupsData(data);
    };
    fetchAllGroupsData();

    return () => {
      controller.abort();
    };
  }, []);

  const handleShowModal = () => {
    showModal ? setShowModal(false) : setShowModal(true);
  };

  const handleNewGroupSubmit = async (newGroupData) => {
    await api.createGroup(newGroupData);
    const { data } = await api.getAllGroups();
    setAllGroupsData(data);
    setShowToast(true);
    setToastMsg(`Group "${newGroupData.name}" successfully created.`);
    handleShowModal();
  };

  const groupsList = allGroupsData.map((group) => (
    <tr key={group.id}>
      <td>{group.id}</td>
      <td>{capitalizeFirstLetter(group.name)}</td>
    </tr>
  ));

  return (
    <>
      <Container>
        <div className="d-flex justify-content-between mb-3 mt-3">
          <h1>Group Management</h1>
          <Button variant="success" onClick={handleShowModal}>
            New Group
          </Button>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>{groupsList}</tbody>
        </Table>
      </Container>
      <AppModal
        showModal={showModal}
        handleShowModal={handleShowModal}
        title="New Group"
      >
        <NewGroupForm handleNewGroupSubmit={handleNewGroupSubmit} />
      </AppModal>
    </>
  );
};

export default GroupManagement;
