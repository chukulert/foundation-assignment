import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useState } from "react";
import { capitalizeFirstLetter } from "../utils/helpers";
import { useEffect } from "react";
import Select from "react-select";

const EditUserForm = (props) => {
  const { user, allGroupsData, modalType, submitEditUser, submitNewUser } = props;
  const [selectedArray, setSelectedArray] = useState([]);
  const [optionsArray, setOptionsArray] = useState([]);
  const [userStatus, setUserStatus] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setSelectedArray([]);
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
    return () => {
      emptyFormFields()
    }
  }, [user, allGroupsData]);

  const emptyFormFields = () => {
    setUsername("");
    setPassword("");
    setEmail("");
    setSelectedArray([]);
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const data = {
      id: user?.id,
      username,
      password,
      email,
      isActive: userStatus,
      groups: selectedArray.map((group) => group.value),
      userGroups: user?.groupIDs
    };

    if (modalType === "edit") {
      submitEditUser(data);
    }
    if (modalType === "new") {
      submitNewUser(data);
      emptyFormFields()
    }
  };

  return (
    <Form onSubmit={handleFormSubmit} className="p-3">
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

      {modalType === "new" && (
        <Form.Group className="mb-3" controlId="floatingPassword">
          <FloatingLabel
            controlId="floatingPassword"
            label="Password"
            className="text-muted"
          >
            <Form.Control
              type="password"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              required
              value={password || ""}
            />
          </FloatingLabel>
        </Form.Group>
      )}

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

      <Form.Group className="mb-3" controlId="formIsActive">
        <FloatingLabel
          controlId="formIsActive"
          label="Status"
          className="text-muted"
        >
          <Form.Select
            aria-label="Status"
            value={userStatus || "1"}
            onChange={(e) => setUserStatus(e.target.value)}
          >
            <option value="1">Enabled</option>
            <option value="0">Disabled</option>
          </Form.Select>
        </FloatingLabel>
      </Form.Group>

      <Form.Label>Group</Form.Label>
      <Select
        options={optionsArray}
        closeMenuOnSelect={false}
        isMulti
        value={selectedArray}
        onChange={(values) => setSelectedArray(values)}
        placeholder="Select Groups"
      />
      <Button variant="primary" type="submit" className="mt-3">
        Submit
      </Button>
    </Form>
  );
};

export default EditUserForm;
