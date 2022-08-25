import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export const ApplicationContext = createContext();

const ApplicationProvider = (props) => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const [applications, setApplications] = useState([]);
  const [plans, setPlans] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [applicationPermissions, setApplicationPermissions] = useState({});
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && applications) {
 
      const result = applications.reduce((map, app) => {
        map[app.app_acronym] = {
          permit_create: checkGroup(
            user.groupIDs,
            JSON.parse(app.app_permit_create)
          ),
          permit_toDoList: checkGroup(
            user.groupIDs,
            JSON.parse(app.app_permit_toDoList)
          ),
          permit_doing: checkGroup(
            user.groupIDs,
            JSON.parse(app.app_permit_doing)
          ),
          permit_done: checkGroup(
            user.groupIDs,
            JSON.parse(app.app_permit_done)
          ),
          permit_close: checkGroup(
            user.groupIDs,
            JSON.parse(app.app_permit_close)
          ),
        };
        return map;
      }, {});

      setApplicationPermissions(result);
    }
  }, [applications, user]);

  const checkGroup = (arr1, arr2) => {
    return arr1.some((group) => arr2.includes(group));
  };

  const checkTaskOptions = (application, task) => {
    let result = {
      promote: null,
      demote: null,
    };
    if (task.task_state === "open")
      result.promote =
        applicationPermissions[application.app_acronym].permit_toDoList;
    if (task.task_state === "toDoList")
      result.promote =
        applicationPermissions[application.app_acronym].permit_doing;
    if (task.task_state === "doing") {
      result.promote =
        applicationPermissions[application.app_acronym].permit_done;
      result.demote =
        applicationPermissions[application.app_acronym].permit_done;
    }
    if (task.task_state === "done") {
      result.promote =
        applicationPermissions[application.app_acronym].permit_close;
      result.demote =
        applicationPermissions[application.app_acronym].permit_close;
    }
    return result;
  };

  return (
    <ApplicationContext.Provider
      value={{
        selectedApplication,
        setSelectedApplication,
        selectedTask,
        setSelectedTask,
        checkTaskOptions,
        applications,
        setApplications,
        plans,
        setPlans,
        tasks,
        setTasks,
        applicationPermissions,
      }}
    >
      {props.children}
    </ApplicationContext.Provider>
  );
};

export default ApplicationProvider;
