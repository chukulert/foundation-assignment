import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useState } from "react";
import { useEffect } from "react";

const NewGroupForm = (props) => {
  const { handleNewGroupSubmit } = props;

  const [name, setName] = useState("");

  const handleOnSubmit = (e) => {
    e.preventDefault();
    handleNewGroupSubmit({ name });
  };

  return (
    <Form onSubmit={handleOnSubmit} className="p-3">
      <Form.Group className="mb-3" controlId="floatingName">
        <FloatingLabel
          controlId="floatingName"
          label="Group Name"
          className="text-muted"
        >
          <Form.Control
            type="text"
            placeholder="Group Name"
            onChange={(e) => setName(e.target.value)}
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

export default NewGroupForm;
