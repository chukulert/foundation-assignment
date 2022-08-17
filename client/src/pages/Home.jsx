import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import * as api from "../api/index";
import ApplicationContainer from "../components/Application/ApplicationContainer";
import TaskContainer from "../components/Task/TaskContainer";
import AppModal from "../components/AppModal";
import TaskModalDetails from "../components/Task/TaskModalDetails";
import { ApplicationContext } from "../context/ApplicationContext";
import { useContext } from "react";
import ApplicationForm from "../components/ApplicationForm";
import Button from "react-bootstrap/Button";
import { ToastContext } from "../context/ToastContext";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import InputGroup from "react-bootstrap/InputGroup";
import "../index.css";

const Home = () => {
  const [applications, setApplications] = useState([]);
  const [plans, setPlans] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [allGroupsData, setAllGroupsData] = useState([]);

  const { selectedApplication, setSelectedApplication, selectedTask } =
    useContext(ApplicationContext);

  const { setShowToast, setToastMsg } = useContext(ToastContext);

  useEffect(() => {
    const controller = new AbortController();
    const fetchAllApplications = async () => {
      await Promise.all([fetchApplications(), fetchAllGroupsData()]);
    };
    fetchAllApplications();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchApplicationData = async () => {
      await Promise.all([fetchTasks(), fetchPlans()]);
    };

    if (selectedApplication) fetchApplicationData();

    return () => {
      controller.abort();
    };
  }, [selectedApplication]);

  const fetchApplications = async () => {
    const { data } = await api.getAllApplications();
    setApplications(data);
    setSelectedApplication(data[0]);
  };

  const fetchPlans = async () => {
    const { data } = await api.getAllPlans(selectedApplication?.app_acronym);
    setPlans(data);
  };

  const fetchTasks = async () => {
    const { data } = await api.getAllTasks(selectedApplication?.app_acronym);
    setTasks(data);
  };

  const fetchAllGroupsData = async () => {
    const { data } = await api.getAllGroups();
    setAllGroupsData(data);
  };

  const handleShowModal = () => {
    showModal ? setShowModal(false) : setShowModal(true);
  };

  const handleShowFormModal = (type) => {
    showFormModal ? setShowFormModal(false) : setShowFormModal(true);
    if (!modalType && type) {
      setModalType(type);
    } else {
      setModalType(null);
    }
  };

  const submitNewApplication = async (formData) => {
    console.log(formData);
    try {
      if (modalType === "Application") {
        await api.createApplication(formData);
        setToastMsg(
          `New Application ${formData.app_acronym} is created successfully.`
        );
      }
      if (modalType === "Plan") {
        await api.createPlan(selectedApplication.app_acronym, formData);
        setToastMsg(
          `New Plan ${formData.plan_mvp_name} is created successfully.`
        );
      }

      if (modalType === "Task") {
        await api.createTask(selectedApplication.app_acronym, formData);
        await fetchTasks();
        setToastMsg(`New Task ${formData.task_name} is created successfully.`);
      }
    } catch (error) {
      setToastMsg(error.response.data.message);
    }
    handleShowFormModal();
    setShowToast(true);
  };

  const updateTaskState = async (task, type) => {
    let updateState = {
      state: null,
    };

    if (type === "promote") {
      if (task.task_state === "open") updateState.state = "toDoList";
      if (task.task_state === "toDoList") updateState.state = "doing";
      if (task.task_state === "doing") updateState.state = "done";
      if (task.task_state === "done") updateState.state = "close";
    }

    if (type === "demote") {
      if (task.task_state === "doing") updateState.state = "toDoList";
      if (task.task_state === "done") updateState.state = "doing";
    }

    try {
      await api.updateTaskState(
        selectedApplication.app_acronym,
        task.task_id,
        updateState
      );
      await fetchTasks();
      setToastMsg("Task has been updated successfully.");
    } catch (error) {
      setToastMsg(error.response.data.message);
    }
    setShowToast(true);
  };

  return (
    <>
      <Container className="smallFont">
        <div className="d-flex justify-content-between">
          <ApplicationContainer applications={applications} />
          <div>
            <InputGroup className="my-3">
              <DropdownButton
                variant="outline-success"
                title="+ New"
                id="input-group"
              >
                <Dropdown.Item
                  onClick={() => handleShowFormModal("Application")}
                >
                  Add Application
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleShowFormModal("Plan")}>
                  Add Plan
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleShowFormModal("Task")}>
                  Add Task
                </Dropdown.Item>cd d
              </DropdownButton>
            </InputGroup>
          </div>
        </div>
        <TaskContainer
          tasks={tasks}
          handleShowModal={handleShowModal}
          updateTaskState={updateTaskState}
        />
      </Container>

      <AppModal
        showModal={showModal}
        title={selectedTask?.task_name}
        handleShowModal={handleShowModal}
      >
        <TaskModalDetails
          handleShowModal={handleShowModal}
          updateTaskState={updateTaskState}
        />
      </AppModal>

      <AppModal
        showModal={showFormModal}
        title={`New ${modalType}`}
        handleShowModal={handleShowFormModal}
      >
        <ApplicationForm
          allGroupsData={allGroupsData}
          modalType={modalType}
          submitNewApplication={submitNewApplication}
          plans={plans}
        />
      </AppModal>
    </>
  );
};

export default Home;
