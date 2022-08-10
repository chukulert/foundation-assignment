import UserTableItem from "./UserTableItem";
import { useState } from "react";
import Table from 'react-bootstrap/Table';

const UserTable = (props) => {
    const {allUserData, handleEditModal, handleResetPasswordModal} = props
    
  const userList = allUserData?.map((user) => (
    <UserTableItem key={user.id} user={user} handleEditModal={handleEditModal} handleResetPasswordModal={handleResetPasswordModal} />
  ));

return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>id</th>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Groups</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {userList}
      </tbody>
    </Table>
  );
};

export default UserTable;
