import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useContext } from "react";
import { ApplicationContext } from "../../context/ApplicationContext";
import { useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Badge from "react-bootstrap/Badge";
import { capitalizeFirstLetter } from "../../utils/helpers";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

const TaskItem = (props) => {
  const { task, handleShowModal, updateTaskState } = props;
  const { setSelectedTask, checkTaskOptions, applications, plans, applicationPermissions } =
    useContext(ApplicationContext);
  const [promote, setPromote] = useState(null);
  const [demote, setDemote] = useState(null);
  const [plan, setPlan] = useState(null);
  const [application, setApplication] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const application = applications.find((app) => {
      return app.app_acronym === task.task_app_acronym;
    });
    const taskPlan = plans.find((plan) => {
      return (
        plan.plan_mvp_name === task.task_plan &&
        plan.plan_app_acronym === task.task_app_acronym
      );
    });

    if (application && user && task) {
      const taskOptions = checkTaskOptions(application, task);
      if (taskOptions.promote) setPromote(taskOptions.promote);
      if (taskOptions.demote) setDemote(taskOptions.demote);
      setApplication(application);
    }
    taskPlan ? setPlan(taskPlan) : setPlan(null)
  }, [applications, plans, user, task]);

  const truncateCharacters = (string) => {
    if (string.length > 18) return string.slice(0, 15) + "...";
    return string;
  };

  const handleDetailsClick = () => {
    setSelectedTask(task);
    handleShowModal();
  };

  const handleStatusClick = (type) => {
    setSelectedTask(task);
    updateTaskState(task, application, type);
  };

  return (
    <Card
      style={{
        width: "10rem",
        height: "13rem",
        borderLeft: plan ? `2px solid ${plan?.plan_color}` : "none" 
      }}
      className="mt-5 card"
    >
      <Card.Header className="d-flex justify-content-between">
        <p>
          App: <strong>{task.task_app_acronym}</strong>
        </p>
        <p>
          <Badge pill bg="dark">
            {task.task_state === "toDoList"
              ? "To-Do"
              : capitalizeFirstLetter(task.task_state)}
          </Badge>
        </p>
      </Card.Header>
      <Card.Body>
        <div className="smallFont">
          <p><strong>Plan: </strong>{task.task_plan ? truncateCharacters(task.task_plan) : "Nil"}</p>
          <p>{truncateCharacters(task.task_name)}</p>
        </div>
      </Card.Body>
      <Card.Footer>
        <div className="d-flex justify-content-between">
          <OverlayTrigger
            overlay={
              <Tooltip id={`demote`}>Demote task to previous step.</Tooltip>
            }
          >
            <Button
              size="sm"
              variant="outline-danger"
              onClick={() => handleStatusClick("demote")}
              className={demote ? "" : "hidden"}
            >
              {"<<"}
            </Button>
          </OverlayTrigger>

          <OverlayTrigger
            overlay={<Tooltip id={`details`}>Task details</Tooltip>}
          >
            <Button
              size="sm"
              variant="secondary"
              id="details"
              onClick={handleDetailsClick}
            >
              +
            </Button>
          </OverlayTrigger>

          <OverlayTrigger
            overlay={
              <Tooltip id={`promote`}>Promote task to next step.</Tooltip>
            }
          >
            <Button
              size="sm"
              variant="outline-success"
              onClick={() => handleStatusClick("promote")}
              className={`"btnFont" ${promote ? "" : "hidden"}`}
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
