import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import { useState } from "react";
import { useEffect } from "react";
import { capitalizeFirstLetter } from "../../utils/helpers";
import { useContext } from "react";
import { ApplicationContext } from "../../context/ApplicationContext";
import { ToastContext } from "../../context/ToastContext";
import * as api from "../../api/index";

const ApplicationEditForm = (props) => {
  const {
    application,
    allGroupsData,
    permitCreate,
    permitToDo,
    permitDoing,
    permitDone,
    permitClose,
    setModalDisplayedApplication,
  } = props;
  const { setToastMsg, setShowToast } = useContext(ToastContext);
  const { setApplications } = useContext(ApplicationContext);

  const [optionsArray, setOptionsArray] = useState([]);
  const [permitCreateValue, setPermitCreateValue] = useState([]);
  const [permitToDoValue, setPermitToDoValue] = useState([]);
  const [permitDoingValue, setPermitDoingValue] = useState([]);
  const [permitDoneValue, setPermitDoneValue] = useState([]);
  const [permitCloseValue, setPermitCloseValue] = useState([]);

  useEffect(() => {
    const formattedGroupsArray = allGroupsData.map((group) => {
      return {
        value: group.id,
        label: capitalizeFirstLetter(group.name),
      };
    });
    setOptionsArray(formattedGroupsArray);

    const createOptionValues = (arr) => {
      return arr.map((group) => {
        return {
          value: group.id,
          label: capitalizeFirstLetter(group.name),
        };
      });
    };

    setPermitCreateValue(createOptionValues(permitCreate));
    setPermitToDoValue(createOptionValues(permitToDo));
    setPermitDoingValue(createOptionValues(permitDoing));
    setPermitDoneValue(createOptionValues(permitDone));
    setPermitCloseValue(createOptionValues(permitClose));
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let formData;

    if (
      !permitCloseValue.length ||
      !permitCreateValue.length ||
      !permitToDoValue.length ||
      !permitDoingValue.length ||
      !permitDoneValue.length
    ) {
      setToastMsg("All fields for permission settings must be filled.");
      setShowToast(true);
      return;
    }

    formData = {
      app_permit_create: permitCreateValue.map((group) => group.value),
      app_permit_toDoList: permitToDoValue.map((group) => group.value),
      app_permit_doing: permitDoingValue.map((group) => group.value),
      app_permit_done: permitDoneValue.map((group) => group.value),
      app_permit_close: permitCloseValue.map((group) => group.value),
    };

    try {
      await api.editApplication(application.app_acronym, formData);
      const { data } = await api.getAllApplications();
      setApplications(data);
      setModalDisplayedApplication(
        data.find((app) => app.app_acronym === application.app_acronym)
      );
      setToastMsg("App permissions successfully updated.");
    } catch (error) {
      setToastMsg(error.response.data.message);
    }
    setShowToast(true);
  };

  return (
    <Form onSubmit={handleFormSubmit} className="p-3">
      <h5 className="border-top pt-1">Edit Permission settings</h5>

      <Form.Label>Create new task:</Form.Label>
      <Select
        options={optionsArray}
        closeMenuOnSelect={false}
        isMulti
        value={permitCreateValue}
        onChange={(values) => setPermitCreateValue(values)}
        placeholder="Select Groups"
        required
      />

      <Form.Label className="mt-3">Approve new task:</Form.Label>
      <Select
        options={optionsArray}
        closeMenuOnSelect={false}
        isMulti
        value={permitToDoValue}
        onChange={(values) => setPermitToDoValue(values)}
        placeholder="Select Groups"
        required
      />

      <Form.Label className="mt-3">Update task state to "Doing":</Form.Label>
      <Select
        options={optionsArray}
        closeMenuOnSelect={false}
        isMulti
        value={permitDoingValue}
        onChange={(values) => setPermitDoingValue(values)}
        placeholder="Select Groups"
        required
      />

      <Form.Label className="mt-3">Update task state to "Done":</Form.Label>
      <Select
        options={optionsArray}
        closeMenuOnSelect={false}
        isMulti
        value={permitDoneValue}
        onChange={(values) => setPermitDoneValue(values)}
        placeholder="Select Groups"
        required
      />

      <Form.Label className="mt-3">Approve completed task:</Form.Label>
      <Select
        options={optionsArray}
        closeMenuOnSelect={false}
        isMulti
        value={permitCloseValue}
        onChange={(values) => setPermitCloseValue(values)}
        placeholder="Select Groups"
        required
      />

      <Button variant="primary" size="sm" type="submit" className="mt-3">
        Submit
      </Button>
    </Form>
  );
};

export default ApplicationEditForm;
