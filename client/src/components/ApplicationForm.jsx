import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useState } from "react";
import { capitalizeFirstLetter } from "../utils/helpers";
import { useEffect } from "react";

const ApplicationForm = (props) => {
  const { allGroupsData, modalType, submitNewApplication, plans } = props;
  const [optionsArray, setOptionsArray] = useState([]);

  const [acronym, setAcronym] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [permitCreate, setPermitCreate] = useState("");
  const [permitToDo, setPermitToDo] = useState("");
  const [permitDoing, setPermitDoing] = useState("");
  const [permitDone, setPermitDone] = useState("");
  const [permitClose, setPermitClose] = useState("");

  const [color, setColor] = useState(null);

  const [plan, setPlan] = useState("");
  const [state, setState] = useState("open");

  useEffect(() => {
    if (modalType === "Application" && allGroupsData) {
      const formattedGroupsArray = allGroupsData.map((group) => (
        <option value={group.id} key={group.id}>
          {capitalizeFirstLetter(group.name)}
        </option>
      ));
      allGroupsData.forEach((group) => {
        if (group.name === "manager") setPermitToDo(group.id);
        if (group.name === "lead") {
          setPermitCreate(group.id);
          setPermitClose(group.id);
        }
        if (group.name === "member") {
          setPermitDoing(group.id);
          setPermitDone(group.id);
        }
      });
      setOptionsArray(formattedGroupsArray);
    }

    if (modalType === "Task" && plans) {
      const nullOption = <option key="empty" value={""}>No Plan Selected</option>;
      const formattedGroupsArray = plans.map((plan) => (
        <option value={plan.plan_mvp_name} key={plan.plan_mvp_name}>
          {plan.plan_mvp_name}
        </option>
      ));
      setOptionsArray([nullOption, ...formattedGroupsArray]);
    }
    return () => {
      //   emptyFormFields()
    };
  }, [allGroupsData, plans]);

  //   const emptyFormFields = () => {
  //     setUsername("");
  //     setPassword("");
  //     setEmail("");
  //     setSelectedArray([]);
  //   }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    let data;
    if (modalType === "Application")
      data = {
        app_acronym: acronym,
        app_description: description,
        app_startDate: startDate,
        app_endDate: endDate,
        app_permit_create: permitCreate,
        app_permit_toDoList: permitToDo,
        app_permit_doing: permitDoing,
        app_permit_done: permitDone,
        app_permit_close: permitClose,
      };

    if (modalType === "Plan")
      data = {
        plan_mvp_name: acronym,
        plan_startDate: startDate,
        plan_endDate: endDate,
        plan_color: color,
        plan_description: description,
      };

    if (modalType === "Task")
      data = {
        task_name: acronym,
        task_description: description,
        task_state: state,
        task_plan: plan,
      };

      console.log(data)
    submitNewApplication(data);
  };

  return (
    <Form onSubmit={handleFormSubmit} className="p-3">
      <Form.Group className="mb-3" controlId="floatingAcronym">
        <FloatingLabel
          controlId="floatingAcronym"
          label={`${modalType} name`}
          className="text-muted"
        >
          <Form.Control
            type="text"
            placeholder={`Enter ${modalType} name`}
            value={acronym}
            onChange={(e) => setAcronym(e.target.value)}
            required
          />
        </FloatingLabel>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="description">Description</Form.Label>
        <Form.Control
          id="description"
          as="textarea"
          rows={3}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>

      {modalType !== "Task" && (
        <>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="startDate">Start Date:</Form.Label>
            <Form.Control
              id="startDate"
              type="date"
              placeholder="Enter Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="endDate">End Date:</Form.Label>
            <Form.Control
              id="endDate"
              type="date"
              placeholder="Enter End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Form.Group>
        </>
      )}

      {modalType === "Plan" && (
        <>
          <Form.Label htmlFor="groupColor">Group category color</Form.Label>
          <Form.Control
            type="color"
            id="groupColor"
            //   value={color}
            title="Group color"
            onChange={(e) => setColor(e.target.value)}
          />
        </>
      )}

      {modalType === "Task" && (
        <>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="plan">Select Plan:</Form.Label>
            <Form.Select
              id="plan"
              aria-label="Plan"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            >
              {optionsArray}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="state">Task State:</Form.Label>
            <Form.Select
              id="state"
              aria-label="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option value="open">Open</option>
              <option value="toDoList">To-Do</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
              <option value="close">Completed</option>
            </Form.Select>
          </Form.Group>
        </>
      )}

      {modalType === "Application" && (
        <>
          <h4 className="border-top pt-1">Permission settings</h4>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="permitCreate">Create new task:</Form.Label>
            <Form.Select
              id="permitCreate"
              aria-label="Role"
              value={permitCreate}
              onChange={(e) => setPermitCreate(e.target.value)}
            >
              {optionsArray}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="permitToDo">Approve new task:</Form.Label>
            <Form.Select
              id="permitToDo"
              aria-label="Role"
              value={permitToDo}
              onChange={(e) => setPermitToDo(e.target.value)}
            >
              {optionsArray}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="permitDoing">
              Update task state to "Doing":
            </Form.Label>
            <Form.Select
              id="permitDoing"
              aria-label="Role"
              value={permitDoing}
              onChange={(e) => setPermitDoing(e.target.value)}
            >
              {optionsArray}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="permitDone">
              Update task state to "Completed":
            </Form.Label>
            <Form.Select
              id="permitDone"
              aria-label="Role"
              value={permitDone}
              onChange={(e) => setPermitDone(e.target.value)}
            >
              {optionsArray}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="permitClose">
              Approve completed task:
            </Form.Label>
            <Form.Select
              id="permitClose"
              aria-label="Role"
              value={permitClose}
              onChange={(e) => setPermitClose(e.target.value)}
            >
              {optionsArray}
            </Form.Select>
          </Form.Group>
        </>
      )}

      <Button variant="primary" type="submit" className="mt-3">
        Submit
      </Button>
    </Form>
  );
};

export default ApplicationForm;
