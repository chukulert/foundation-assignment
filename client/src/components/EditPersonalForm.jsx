import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useState } from "react";
import { useEffect } from "react";

const EditPersonalForm = (props) => {
  const { updatePersonalDetails, modalType, user } = props;

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(user.email);

    useEffect(() => {
        setEmail(user.email)
    }, [user])
  const handleFormSubmit = (e) => {
    e.preventDefault();
    modalType === "password"
      ? updatePersonalDetails({password})
      : updatePersonalDetails({email});
  };

  return (
    <Form onSubmit={handleFormSubmit} className="p-3">
      {modalType === "password" && (
        <Form.Group className="mb-3" controlId="floatingPassword">
          <FloatingLabel
            controlId="floatingPassword"
            label="New Password"
            className="text-muted"
          >
            <Form.Control
              type="password"
              placeholder="Enter new password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FloatingLabel>
        </Form.Group>
      )}

      {modalType === "email" && (
        <Form.Group className="mb-3" controlId="floatingPassword">
          <FloatingLabel
            controlId="floatingPassword"
            label="New Email"
            className="text-muted"
          >
            <Form.Control
              type="email"
              placeholder="Enter new email address"
              onChange={(e) => setEmail(e.target.value)}
            value={email}
            />
          </FloatingLabel>
        </Form.Group>
      )}

      <Button variant="primary" type="submit" className="mt-3">
        Submit
      </Button>
    </Form>
  );
};

export default EditPersonalForm;
