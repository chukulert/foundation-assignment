import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useContext } from "react";
import { ApplicationContext } from "../../context/ApplicationContext";
import { useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Badge from "react-bootstrap/Badge";
import { capitalizeFirstLetter } from "../../utils/helpers";
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

const TaskItem = (props) => {
  const { task, handleShowModal, updateTaskState } = props;
  const {
    setSelectedTask,
    checkTaskOptions,
    selectedApplication,
  } = useContext(ApplicationContext);
  const [promote, setPromote] = useState(null);
  const [demote, setDemote] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (selectedApplication && user && task) {
      const taskOptions = checkTaskOptions(selectedApplication, user, task);
      if (taskOptions.promote) setPromote(taskOptions.promote);
      if (taskOptions.demote) setDemote(taskOptions.demote);
    }
  }, [selectedApplication, user, task]);

  const truncateCharacters = (string) => {
    if (string.length > 25) return string.slice(0, 45) + "...";
    return string;
  };

  const description = truncateCharacters(task?.task_description);

  const handleDetailsClick = () => {
    setSelectedTask(task);
    handleShowModal();
  };

  const handleStatusClick = (type) => {
    setSelectedTask(task);
    updateTaskState(task, type);
  };

  return (
    <Card
      style={{ width: "12rem", height: "15rem" }}
      className="mt-5"
    >
      <Card.Header className="d-flex justify-content-between">
        <p>{task.task_plan ? task.task_plan : ""} </p>
        <p>
          <Badge pill bg="dark">
            {task.task_state === "toDoList" ? "To-Do" : capitalizeFirstLetter(task.task_state)}
          </Badge>
        </p>
      </Card.Header>
      <Card.Body>
        <Card.Title>{task.task_name}</Card.Title>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <div className="fw-light fs-8 mb-1">
           Updated by: User {task.task_owner}
        </div>
        <div className="d-flex justify-content-between">
         
            <OverlayTrigger
            overlay={
                <Tooltip id={`demote`}>
                  Demote task to previous step.
                </Tooltip>
              }>
            <Button
              size="sm"
              variant="outline-danger"
              onClick={() => handleStatusClick("demote")}
              disabled={demote ? false : true}
            >
              {"<<"}
            </Button>
            </OverlayTrigger>
          
          <Button size="sm" variant="secondary" onClick={handleDetailsClick}>
            Details
          </Button>
    
          
            <OverlayTrigger
            overlay={
                <Tooltip id={`promote`}>
                  Promote task to next step.
                </Tooltip>
              }>
            <Button
              size="sm"
              variant="outline-success"
              onClick={() => handleStatusClick("promote")}
              disabled={promote ? false : true}
            >
              {">>"}
            </Button>
            </OverlayTrigger>
       
        </div>
      </Card.Footer>
    </Card>
  );
};

export default TaskItem;
