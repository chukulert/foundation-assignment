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
import { ToastContext } from "../context/ToastContext";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import InputGroup from "react-bootstrap/InputGroup";
import "../index.css";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/SideBar/SideBar";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);

  const [modalType, setModalType] = useState(null);
  const [allGroupsData, setAllGroupsData] = useState([]);
  const [isLead, setIsLead] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [isTaskCreator, setIsTaskCreator] = useState(false);

  const [displayedPlans, setDisplayedPlans] = useState([]);
  const [displayedTasks, setDisplayedTasks] = useState([]);

  const {
    selectedApplication,
    setSelectedApplication,
    selectedTask,
    setSelectedTask,
    setPlans,
    setApplications,
    setTasks,
    plans,
    tasks,
    applications,
    applicationPermissions,
  } = useContext(ApplicationContext);
  const { setShowToast, setToastMsg } = useContext(ToastContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const controller = new AbortController();
    const fetchAllApplications = async () => {
      await Promise.all([
        fetchApplications(),
        fetchAllGroupsData(),
        fetchAllTasks(),
        fetchAllPlans(),
      ]);
    };
    fetchAllApplications();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (selectedApplication) {
      const filteredTasks = tasks.filter((task) => {
        return task.task_app_acronym === selectedApplication.app_acronym;
      });
      const filteredPlans = plans.filter((plan) => {
        return plan.plan_app_acronym === selectedApplication.app_acronym;
      });
      setDisplayedTasks(filteredTasks);
      setDisplayedPlans(filteredPlans);
    } else {
      setDisplayedTasks(tasks);
      setDisplayedPlans(plans);
    }
  }, [selectedApplication, tasks, plans]);

  useEffect(() => {
    if (user) {
      user.groups.forEach((group) => {
        if (group.name === "manager") setIsManager(true);
        if (group.name === "lead") setIsLead(true);
      });
    }

    if (applicationPermissions) {
      for (const app of Object.entries(applicationPermissions)) {
        if (app[1].permit_create) {
          setIsTaskCreator(true);
          break;
        }
      }
    }
  }, [user, applicationPermissions]);

  const fetchApplications = async () => {
    const { data } = await api.getAllApplications();
    setApplications(data);
  };

  const fetchAllPlans = async () => {
    const { data } = await api.getAllPlans();
    setPlans(data);
  };

  const fetchAllTasks = async () => {
    const { data } = await api.getAllTasks();
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
    try {
      if (modalType === "Application") {
        await api.createApplication(formData);
        await fetchApplications();
        setToastMsg(
          `New Application ${formData.app_acronym} is created successfully.`
        );
      }
      if (modalType === "Plan") {
        await api.createPlan(formData.plan_app_acronym, formData);
        await fetchAllPlans();
        setToastMsg(
          `New Plan "${formData.plan_mvp_name}" is created successfully.`
        );
      }

      if (modalType === "Task") {
        console.log(formData)
        await api.createTask(formData.task_app_acronym, formData);
        await fetchAllTasks();
        setToastMsg(`New Task ${formData.task_name} is created successfully.`);
      }
    } catch (error) {
      setToastMsg(error.response.data.message);
    }
    setShowToast(true);
  };

  const updateTaskState = async (task, application, type) => {
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
        application.app_acronym,
        task.task_id,
        updateState
      );
      await fetchAllTasks();
      setToastMsg(`Task state updated to "${updateState.state}" successfully.`);
      if (type === "promote" && updateState.state === "done") {
        await api.sendTaskEmail(application.app_acronym, task.task_id);
      }
    } catch (error) {
      setToastMsg(error.response.data.message);
    }
    setShowToast(true);
  };

  const editTaskDetails = async (task, data) => {

    try {
      await api.editTask(task.task_app_acronym, task.task_id, data);
      setToastMsg(
        `${
          data.notes
            ? "Task note has been added successfully"
            : "Task plan edited successfully"
        }`
      );
      const fetchedData = await api.findTask(task.task_id);
      const updatedTask = fetchedData.data;

      const taskIndex = tasks.findIndex(
        (task) => task.task_id === updatedTask.task_id
      );
      const tasksArr = [...tasks];
      tasksArr[taskIndex] = updatedTask;
      setTasks(tasksArr);
      setSelectedTask(updatedTask);
    } catch (error) {
      setToastMsg(error.response.data.message);
    }
    setShowToast(true);
  };

  return (
    <div className="d-flex">
      <Sidebar
        handleShowModal={handleShowModal}
        allGroupsData={allGroupsData}
      />
      <Container className="smallFont mb-3 px-4">
        <div className="d-flex justify-content-between">
          <ApplicationContainer applications={applications} />
          <h3 className="mt-3">
            {selectedApplication?.app_acronym
              ? selectedApplication.app_acronym
              : "All"}
          </h3>
          {(isLead || isManager || isTaskCreator) ?  
          <div>
            <InputGroup className="my-3">
              <DropdownButton
                variant="outline-success"
                title="+ New"
                id="input-group"
              >
                {isLead && (
                  <Dropdown.Item
                    onClick={() => handleShowFormModal("Application")}
                  >
                    Add Application
                  </Dropdown.Item>
                )}
                {isManager && (
                  <Dropdown.Item onClick={() => handleShowFormModal("Plan")}>
                    Add Plan
                  </Dropdown.Item>
                )}
                {isTaskCreator && (
                  <Dropdown.Item onClick={() => handleShowFormModal("Task")}>
                    Add Task
                  </Dropdown.Item>
                )}
              </DropdownButton>
            </InputGroup>
          </div> : <div></div>}
        </div>
        <TaskContainer
          tasks={displayedTasks}
          handleShowModal={handleShowModal}
          updateTaskState={updateTaskState}
        />
      </Container>

      <AppModal
        showModal={showModal}
        title={`${selectedTask?.task_name} (${selectedTask?.task_state === "toDoList"
        ? "To-Do"
        : (selectedTask?.task_state)})`}
        handleShowModal={handleShowModal}
      >
        <TaskModalDetails
          handleShowModal={handleShowModal}
          updateTaskState={updateTaskState}
          editTaskDetails={editTaskDetails}
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
          plans={displayedPlans}
        />
      </AppModal>
    </div>
  );
};

export default Home;
