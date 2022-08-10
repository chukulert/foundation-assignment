import { useState } from "react";
import { useEffect } from "react";
import Container from "react-bootstrap/Container";
import * as api from "../api/index"
import Table from "react-bootstrap/Table";

const GroupManagement = () => { 
  const [allGroupsData, setAllGroupsData] = useState([]);

  useEffect(() => {
    const fetchAllGroupsData = async () => {
      const { data } = await api.getAllGroups();
      setAllGroupsData(data);
    };
    fetchAllGroupsData();
  }, []);

  const groupsList = allGroupsData.map((group) => (
    <tr key={group.id}>
      <td>{group.id}</td>
      <td>{group.name}</td>
    </tr>
  ));

  return (
    <>
      <Container>
        <h1>Group Management</h1>
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
    </>
  );
};

export default GroupManagement;
