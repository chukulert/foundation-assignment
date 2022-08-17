import { createContext, useState } from "react";

export const ApplicationContext = createContext();

const ApplicationProvider = (props) => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const checkTaskOptions = (application, user, task) => {
    let result = {
      promote: null,
      demote: null,
    };
    if (user && user.groupIDs) {
      if (task.task_state === "open") {
        if (user.groupIDs.includes(application.app_permit_toDoList)) {
          result.promote = application.app_permit_toDoList;
        }
      }

      if (task.task_state === "toDoList") {
        if (user.groupIDs.includes(application.app_permit_doing)) {
          result.promote = application.app_permit_doing;
        }
      }

      if (task.task_state === "doing") {
        if (user.groupIDs.includes(application.app_permit_done)) {
          result.promote = application.app_permit_done;
          result.demote = application.app_permit_done;
        }
      }

      if (task.task_state === "done") {
        if (user.groupIDs.includes(application.app_permit_close)) {
          result.promote = application.app_permit_close;
          result.demote = application.app_permit_close;
        }
      }
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
      }}
    >
      {props.children}
    </ApplicationContext.Provider>
  );
};

export default ApplicationProvider;
