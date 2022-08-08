import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useState } from "react";
import { capitalizeFirstLetter } from "../utils/helpers";
import { useEffect } from "react";
import Select from "react-select";

const EditUserForm = (props) => {
  const { user, allGroupsData } = props;
  const [selectedArray, setSelectedArray] = useState([]);
  const [optionsArray, setOptionsArray] = useState([]);
  const [userStatus, setUserStatus] = useState("");
  const [userRole, setUserRole] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  console.log(selectedArray);
  console.log(optionsArray);
  useEffect(() => {
    if (user) {
      setUserRole(user.role);
      setUserStatus(user.isActive);
      setEmail(user.email);
      setUsername(user.username);
      if (user.groups) {
        const formattedGroupsArray = user.groups.map((group) => {
          return {
            value: group.group_id,
            label: capitalizeFirstLetter(group.name),
          };
        });
        setSelectedArray(formattedGroupsArray);
      } else {
        setSelectedArray([]);
      }
    }
    if (allGroupsData) {
      const formattedGroupsArray = allGroupsData.map((group) => {
        return {
          value: group.id,
          label: capitalizeFirstLetter(group.name),
        };
      });
      setOptionsArray(formattedGroupsArray);
    }
  }, [user, allGroupsData]);

  //   const handleSelectChange = (e) => {
  //     setSelectedArray(e)
  //   }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const data = {
      username: username,
      email: email,
      isActive: userStatus,
      role: userRole,
      groups: selectedArray,
    };

    console.log(data);
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      <Form.Group className="mb-3" controlId="floatingUsername">
        <FloatingLabel
          controlId="floatingUsername"
          label="Username"
          className="text-muted"
        >
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </FloatingLabel>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formEmail">
        <FloatingLabel
          controlId="formEmail"
          label="Email"
          className="text-muted"
        >
          <Form.Control
            type="email"
            placeholder="Email"
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FloatingLabel>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formRole">
        <FloatingLabel controlId="formRole" label="Role" className="text-muted">
          <Form.Select
            aria-label="Role"
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
          >
            <option>Select role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </Form.Select>
        </FloatingLabel>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formIsActive">
        <FloatingLabel
          controlId="formIsActive"
          label="Status"
          className="text-muted"
        >
          <Form.Select
            aria-label="Status"
            value={userStatus || ""}
            onChange={(e) => setUserStatus(e.target.value)}
          >
            <option>Select status</option>
            <option value="1">Enabled</option>
            <option value="0">Disabled</option>
          </Form.Select>
        </FloatingLabel>
      </Form.Group>
      
        <Select
          options={optionsArray}
          closeMenuOnSelect={false}
          isMulti
          defaultValue={selectedArray}
          onChange={(values) => setSelectedArray(values)}
        />
 

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default EditUserForm;
