import { useEffect, useContext, useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { ApplicationContext } from "../../context/ApplicationContext";
import { formatDateString } from "../../utils/helpers";
import { AuthContext } from "../../context/AuthContext";
import Accordion from "react-bootstrap/Accordion";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

const TaskModalDetails = (props) => {
  const { handleShowModal, updateTaskState } = props;
  const { selectedApplication, selectedTask, checkTaskOptions } =
    useContext(ApplicationContext);
  const { user } = useContext(AuthContext);

  const [promote, setPromote] = useState(null);
  const [demote, setDemote] = useState(null);

  useEffect(() => {
    if (selectedApplication && selectedTask && user) {
      const taskOptions = checkTaskOptions(
        selectedApplication,
        user,
        selectedTask
      );
      if (taskOptions.promote) setPromote(taskOptions.promote);
      if (taskOptions.demote) setDemote(taskOptions.demote);
    }
  }, [selectedApplication, selectedTask, user]);

  const taskNotesArr = JSON.parse(selectedTask?.task_notes);

  const taskNotes = taskNotesArr.map((task, index) => (
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
  ));

  const onClickHandler = (type) => {
    updateTaskState(selectedTask, type);
    handleShowModal();
  };

  return (
    <Container>
      <div className="mt-3 border-bottom">
        <p>
          <strong>Application: </strong>
          {selectedTask.task_app_acronym}
        </p>
        <p>
          <strong>Plan: </strong>
          {selectedTask.task_plan}
        </p>
        <p>
          <strong>Created by: </strong>
          User {selectedTask.task_creator}
        </p>
        <p>
          <strong>Created on: </strong>
          {formatDateString(selectedTask.task_createDate)}
        </p>
        <p>
          <strong>Last updated by: </strong>
          User {selectedTask.task_owner}
        </p>
        <p>
          <strong>Description: </strong>
          {selectedTask.task_description}
        </p>
      </div>

      <div className="d-flex justify-content-end mt-3 mb-3">
        {demote && (
          <OverlayTrigger
            overlay={
              <Tooltip id={`demote`}>Demote task to previous step.</Tooltip>
            }
          >
            <Button
              className="mx-3"
              size="sm"
              onClick={() => onClickHandler("demote")}
              variant="outline-danger"
            >
              {"<<"}
            </Button>
          </OverlayTrigger>
        )}
        {promote && (
          <OverlayTrigger
            overlay={
              <Tooltip id={`promote`}>Promote task to next step.</Tooltip>
            }
          >
            <Button
              size="sm"
              onClick={() => onClickHandler("promote")}
              variant="outline-success"
            >
              {">>"}
            </Button>
          </OverlayTrigger>
        )}
      </div>

      <Accordion flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Task Audit Log</Accordion.Header>
          <Accordion.Body>
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
            {taskNotes}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default TaskModalDetails;
