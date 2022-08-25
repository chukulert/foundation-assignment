import { useEffect, useContext, useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { ApplicationContext } from "../../context/ApplicationContext";
import { formatDateString } from "../../utils/helpers";
import { AuthContext } from "../../context/AuthContext";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Dropdown from "react-bootstrap/Dropdown";
import TaskNotes from "./TaskNotes";

const TaskModalDetails = (props) => {
  const { handleShowModal, updateTaskState, editTaskDetails } = props;
  const { applications, plans, selectedTask, checkTaskOptions } =
    useContext(ApplicationContext);
  const { user } = useContext(AuthContext);
  const [application, setApplication] = useState(null);
  const [promote, setPromote] = useState(null);
  const [demote, setDemote] = useState(null);
  const [inputNotes, setInputNotes] = useState("");
  const [planOptions, setPlanOptions] = useState([]);
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    const application = applications.find((app) => {
      return app.app_acronym === selectedTask.task_app_acronym;
    });

    /**This ocnfigures the options allowed to promote/demote a task on the modal */
    if (application && selectedTask) {
      const taskOptions = checkTaskOptions(application, selectedTask);
      if (taskOptions.promote) setPromote(taskOptions.promote);
      if (taskOptions.demote) setDemote(taskOptions.demote);
      setApplication(application);

      user.groups.forEach((group) => {
        if (group.name === "manager") {
          setIsManager(true);
        }
      });
    }

    /**This configures the plan options displayed on the modal */
    if (selectedTask) {
      const applicationPlans = plans.filter((plan) => {
        return plan.plan_app_acronym === application.app_acronym;
      });
      let plansList = applicationPlans.map((plan) => (
        <Dropdown.Item
          id={plan.plan_mvp_name}
          onClick={handlePlanClick}
          key={plan.plan_mvp_name}
        >
          {plan.plan_mvp_name}
        </Dropdown.Item>
      ));
      if (!selectedTask.task_plan) {
        setPlanOptions(plansList);
      } else {
        plansList = plansList.filter((plan) => {
          return selectedTask.task_plan !== plan.key;
        });
        const removePlanOption = (
          <Dropdown.Item id={""} onClick={handlePlanClick} key={0}>
            Remove Plan
          </Dropdown.Item>
        );
        setPlanOptions([removePlanOption, ...plansList]);
      }
    }
  }, [applications, plans, selectedTask, user]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    editTaskDetails(selectedTask, { notes: inputNotes });
  };

  const handlePlanClick = (e) => {
    editTaskDetails(selectedTask, { task_plan: e.target.id });
  };

  const onClickHandler = (type) => {
    updateTaskState(selectedTask, application, type);
    handleShowModal();
  };

  return (
    <Container className="smallFont">
      {selectedTask.task_state !== "close" && (
        <div className="d-flex justify-content-between py-3 border-bottom">
          <OverlayTrigger
            overlay={
              <Tooltip id={`demote`}>Demote task to previous step.</Tooltip>
            }
          >
            <Button
              className={`${demote ? "" : "hidden"}`}
              size="sm"
              onClick={() => onClickHandler("demote")}
              variant="outline-danger"
            >
              {"<< Demote"}
            </Button>
          </OverlayTrigger>

          {isManager && (
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-basic" size="sm">
                Assign Plan
              </Dropdown.Toggle>
              <Dropdown.Menu>{planOptions}</Dropdown.Menu>
            </Dropdown>
          )}

          <OverlayTrigger
            overlay={
              <Tooltip id={`promote`}>Promote task to next step.</Tooltip>
            }
          >
            <Button
              size="sm"
              onClick={() => onClickHandler("promote")}
              variant="outline-success"
              className={`${promote ? "" : "hidden"}`}
            >
              {"Promote >>"}
            </Button>
          </OverlayTrigger>
        </div>
      )}

      <div className="mt-3 border-bottom">
        <p>
          <strong>Application: </strong>
          {selectedTask.task_app_acronym}
        </p>
        <p>
          <strong>Plan: </strong>
          {selectedTask.task_plan ? selectedTask.task_plan : "Nil"}
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
        <p className="d-flex">
          <strong>Description: </strong>
          <textarea
            readOnly={true}
            className="mx-3"
            cols="60"
            value={selectedTask.task_description}
          ></textarea>
        </p>
      </div>

      {(promote || demote) && <Form onSubmit={handleFormSubmit} className="p-3">
        <Form.Group className="mb-3 border-bottom">
          <Form.Label htmlFor="notes">
            <strong>New Task Note</strong>
          </Form.Label>
          <Form.Control
            id="notes"
            as="textarea"
            rows={3}
            placeholder="Enter new task note"
            value={inputNotes}
            onChange={(e) => setInputNotes(e.target.value)}
          />
        </Form.Group>

        <div className="d-flex justify-content-end">
          <Button variant="primary" type="submit" size="sm">
            Submit
          </Button>
        </div>
      </Form>}
      
      <TaskNotes />
    </Container>
  );
};

export default TaskModalDetails;
