import { useContext } from "react";
import { ApplicationContext } from "../../context/ApplicationContext";
import Accordion from "react-bootstrap/Accordion";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const TaskNotes = () => {
  const { selectedTask } = useContext(ApplicationContext);

  const taskNotesArr = JSON.parse(selectedTask?.task_notes);

  const taskNotes = taskNotesArr?.reverse().map((task, index) => (
    <div className="mb-3 bg-light p-2" key={`${task.Timestamp} ${index}`}>
      <Row>
        <Col xs lg="3">
          <strong>User ID</strong>
        </Col>
        <Col xs lg="3">
          <strong>State</strong>
        </Col>
        <Col xs lg="5">
          <strong>Timestamp</strong>
        </Col>
      </Row>
      <Row key={task.Timestamp}>
        <Col xs lg="3">
          {task.userId}
        </Col>
        <Col xs lg="3">
          {task.state}
        </Col>
        <Col xs lg="5">
          {task.Timestamp}
        </Col>
      </Row>
      <Row className="mt-1">
        <p>
          <strong>Note: </strong>
          <textarea cols="60" readOnly={true} value={task.notes}></textarea>
        </p>
      </Row>
    </div>
  ));

  return (
    <div >
    <Accordion flush>
      <Accordion.Item eventKey="0" >
        <Accordion.Header>Task Audit Log</Accordion.Header>
        <Accordion.Body >{taskNotes}</Accordion.Body>
      </Accordion.Item>
    </Accordion>
    </div>
  );
};

export default TaskNotes;
