import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useState } from "react";

const PasswordResetForm = (props) => {
  const { submitResetPassword } = props;
  const [password, setPassword] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    submitResetPassword(password);
  };

  return (
    <Form onSubmit={handleFormSubmit} className="p-3">
      <Form.Group className="mb-3" controlId="floatingPassword">
        <FloatingLabel
          controlId="floatingPassword"
          label="Password"
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

      <Button variant="primary" type="submit" className="mt-3">
        Submit
      </Button>
    </Form>
  );
};

export default PasswordResetForm;
