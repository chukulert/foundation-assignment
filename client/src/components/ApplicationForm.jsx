import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useState, useContext } from "react";
import { capitalizeFirstLetter } from "../utils/helpers";
import { useEffect } from "react";
import { ApplicationContext } from "../context/ApplicationContext";
import Select from "react-select";
import { ToastContext } from "../context/ToastContext";

const ApplicationForm = (props) => {
  const { allGroupsData, modalType, submitNewApplication } = props;
  const { applications, selectedApplication, plans, applicationPermissions } =
    useContext(ApplicationContext);

  const { setToastMsg, setShowToast } = useContext(ToastContext);

  const [optionsArray, setOptionsArray] = useState([]);
  const [planOptionsArray, setPlanOptionsArray] = useState([]);
  const [acronym, setAcronym] = useState("");
  const [rNumber, setRNumber] = useState(0);
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [permitCreate, setPermitCreate] = useState([]);
  const [permitToDo, setPermitToDo] = useState([]);
  const [permitDoing, setPermitDoing] = useState([]);
  const [permitDone, setPermitDone] = useState([]);
  const [permitClose, setPermitClose] = useState([]);

  const [applicationValue, setApplicationValue] = useState("");
  const [color, setColor] = useState(null);

  const [plan, setPlan] = useState("");

  useEffect(() => {
    /**Set options for group selection */
    if (modalType === "Application" && allGroupsData) {
      const formattedGroupsArray = allGroupsData.map((group) => {
        return {
          value: group.id,
          label: capitalizeFirstLetter(group.name),
        };
      });

      /**Set pre-selected options for each task based on assignment specs */
      allGroupsData.forEach((group) => {
        if (group.name === "manager")
          setPermitToDo([
            {
              value: group.id,
              label: capitalizeFirstLetter(group.name),
            },
          ]);
        if (group.name === "lead") {
          setPermitCreate([
            {
              value: group.id,
              label: capitalizeFirstLetter(group.name),
            },
          ]);
          setPermitClose([
            {
              value: group.id,
              label: capitalizeFirstLetter(group.name),
            },
          ]);
        }
        if (group.name === "member") {
          setPermitDoing([
            {
              value: group.id,
              label: capitalizeFirstLetter(group.name),
            },
          ]);
          setPermitDone([
            {
              value: group.id,
              label: capitalizeFirstLetter(group.name),
            },
          ]);
        }
      });
      setOptionsArray(formattedGroupsArray);
    }

    if (modalType === "Plan" && applications) {
      const formattedGroupsArray = applications.map((app) => (
        <option value={app.app_acronym} key={app.app_acronym}>
          {app.app_acronym}
        </option>
      ));
      setOptionsArray(formattedGroupsArray);
      if (selectedApplication) {
        setApplicationValue(selectedApplication.app_acronym);
      } else {
        setApplicationValue(applications[0].app_acronym);
      }
    }

    if (modalType === "Task") {
      /**Sets app options available based on permissions granted */
      let arr = [];
      for (const app of Object.entries(applicationPermissions)) {
        if (app[1].permit_create) {
          arr.push(app[0]);
        }
      }

      selectedApplication
        ? setApplicationValue(selectedApplication.app_acronym)
        : setApplicationValue(arr[0].app_acronym);

      const formattedAppArray = arr.map((app) => (
        <option value={app} key={app}>
          {app}
        </option>
      ));
      setOptionsArray(formattedAppArray);
    }

    return () => {};
  }, [allGroupsData, plans, applications]);

  useEffect(() => {
    /**Sets plan options based on the currently selected application */
    const appPlans = plans.filter((plan) => {
      return plan.plan_app_acronym === applicationValue;
    });

    const nullOption = (
      <option key="empty" value={""}>
        No Plan Selected
      </option>
    );
    const formattedGroupsArray = appPlans.map((plan) => (
      <option value={plan.plan_mvp_name} key={plan.plan_mvp_name}>
        {plan.plan_mvp_name}
      </option>
    ));
    setPlanOptionsArray([nullOption, ...formattedGroupsArray]);
  }, [applicationValue]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    let data;

    if (modalType === "Application") {
      if (
        !permitClose.length ||
        !permitCreate.length ||
        !permitToDo.length ||
        !permitDoing.length ||
        !permitDone.length
      ) {
        setToastMsg("All fields for permission settings must be filled.");
        setShowToast(true);
        return;
      }

      data = {
        app_acronym: acronym,
        app_description: description,
        app_Rnumber: rNumber,
        app_startDate: startDate,
        app_endDate: endDate,
        app_permit_create: permitCreate.map((group) => group.value),
        app_permit_toDoList: permitToDo.map((group) => group.value),
        app_permit_doing: permitDoing.map((group) => group.value),
        app_permit_done: permitDone.map((group) => group.value),
        app_permit_close: permitClose.map((group) => group.value),
      };
    }

    if (modalType === "Plan")
      data = {
        plan_mvp_name: acronym,
        plan_startDate: startDate,
        plan_app_acronym: applicationValue,
        plan_endDate: endDate,
        plan_color: color,
        plan_description: description,
      };

    if (modalType === "Task")
      data = {
        task_app_acronym: applicationValue,
        task_name: acronym,
        task_description: description,
        task_plan: plan,
      };

    submitNewApplication(data);
  };
  console.log(optionsArray)
  console.log(planOptionsArray)

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

      {modalType === "Application" && (
        <>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="rNumber">App Rnumber</Form.Label>
            <Form.Control
              id="rNumber"
              type="number"
              value={rNumber}
              onChange={(e) => setRNumber(e.target.value)}
              required
            />
          </Form.Group>
        </>
      )}

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
              required
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
              required
            />
          </Form.Group>
        </>
      )}

      {(modalType === "Task" || modalType === 'Plan') && (
        <Form.Group className="mb-3">
          <Form.Label htmlFor="application">Select Application:</Form.Label>
          <Form.Select
            id="application"
            aria-label="Application"
            value={applicationValue}
            onChange={(e) => setApplicationValue(e.target.value)}
          >
            {optionsArray}
          </Form.Select>
        </Form.Group>
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
              {planOptionsArray}
            </Form.Select>
          </Form.Group>
        </>
      )}

      {modalType === "Application" && (
        <>
          <h5 className="border-top pt-1">Permission settings</h5>

          <Form.Label>Create new task:</Form.Label>
          <Select
            options={optionsArray}
            closeMenuOnSelect={false}
            isMulti
            value={permitCreate}
            onChange={(values) => setPermitCreate(values)}
            placeholder="Select Groups"
            required
          />

          <Form.Label className="mt-3">Approve new task:</Form.Label>
          <Select
            options={optionsArray}
            closeMenuOnSelect={false}
            isMulti
            value={permitToDo}
            onChange={(values) => setPermitToDo(values)}
            placeholder="Select Groups"
            required
          />

          <Form.Label className="mt-3">
            Update task state to "Doing":
          </Form.Label>
          <Select
            options={optionsArray}
            closeMenuOnSelect={false}
            isMulti
            value={permitDoing}
            onChange={(values) => setPermitDoing(values)}
            placeholder="Select Groups"
            required
          />

          <Form.Label className="mt-3">Update task state to "Done":</Form.Label>
          <Select
            options={optionsArray}
            closeMenuOnSelect={false}
            isMulti
            value={permitDone}
            onChange={(values) => setPermitDone(values)}
            placeholder="Select Groups"
            required
          />

          <Form.Label className="mt-3">Approve completed task:</Form.Label>
          <Select
            options={optionsArray}
            closeMenuOnSelect={false}
            isMulti
            value={permitClose}
            onChange={(values) => setPermitClose(values)}
            placeholder="Select Groups"
            required
          />
        </>
      )}

      <Button variant="primary" type="submit" className="mt-3">
        Submit
      </Button>
    </Form>
  );
};

export default ApplicationForm;
