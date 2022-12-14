import { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "../../utils/helpers";
import Button from "react-bootstrap/esm/Button";

const UserTableItem = (props) => {
  const { user, handleEditModal, handleResetPasswordModal } = props;
  const [userGroups, setUserGroups] = useState("");

  useEffect(() => {
    if (user.groups) {
      let userGroupString = "";
      userGroupString = user.groups.forEach((group, index) => {
        if (index !== user.groups.length - 1) {
          userGroupString += ` ${capitalizeFirstLetter(group.name)} | `;
        } else {
          userGroupString += ` ${capitalizeFirstLetter(group.name)} `;
        }
        setUserGroups(userGroupString);
      });
    } else {
      setUserGroups("");
    }
  }, [user]);

  const handleEdit = () => {
    handleEditModal(user, "edit");
  };

  const handleResetPassword = () => {
    handleResetPasswordModal(user);
  };

  return (
    <tr>
      <td>{user.id}</td>
      <td>{user.username}</td>
      <td>{user.email}</td>
      <td>{userGroups}</td>
      <td className={user.isActive === "1" ? "text-success" : "text-danger"}>
        {user.isActive === "1" ? "Enabled" : "Disabled"}
      </td>
      <td className="d-flex">
        <Button onClick={handleEdit} variant="primary">
          Edit
        </Button>
        <Button onClick={handleResetPassword} variant="secondary">
          Password
        </Button>
      </td>
    </tr>
  );
};

export default UserTableItem;
