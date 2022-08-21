import styles from "./SideBar.module.css";
import { useState } from "react";
import { useContext } from "react";
import Badge from "react-bootstrap/Badge";
import { ApplicationContext } from "../../context/ApplicationContext";

const AppDropList = (props) => {
  const { app, handlePlanClick, handleShowModal, handleAppClick } = props;
  const { setSelectedTask, tasks } = useContext(ApplicationContext);
  const [showList, setShowList] = useState(false);

  const handleShowListClick = () => {
    showList ? setShowList(false) : setShowList(true);
  };

  const handleTaskClick = (e) => {
    const task = tasks.find((task) => task.task_id === e.target.id);
    setSelectedTask(task);
    handleShowModal();
  };

  const truncateCharacters = (string, strLimit) => {
    if (string.length > strLimit + 5) return string.slice(0, strLimit) + "...";
    return string;
  };
 
  return (
    <div key={app.app_acronym} className="mt-2 mx-2">
      <span className={`d-flex justify-content-between`}>
        <strong onClick={handleShowListClick} className={styles.listItem}>
          {truncateCharacters(app.app_acronym, 25)} {showList ? "-" : "+"}
        </strong>
        <Badge pill bg="dark" onClick={handleAppClick} id={app.app_acronym} className='pointer'>
          Details
        </Badge>
      </span>
      {showList && (
        <div>
          <div>
            {app.plans?.map((plan) => (
              <div
                className="mx-2"
                key={plan.plan_mvp_name}
              >
                <span
                  className={`${styles.listItem} px-1`}
                  style={{ borderLeft: `2px solid ${plan?.plan_color}`}}
                  onClick={handlePlanClick}
                  id={plan.plan_mvp_name}
                >
                  {truncateCharacters(plan.plan_mvp_name, 20)}
                </span>
                {plan.tasks?.map((task) => (
                  <li
                    className="mx-2"
                    onClick={handleTaskClick}
                    key={task.task_id}
                  >
                    <span className={`${styles.listItem} list` } id={task.task_id}>
                      {truncateCharacters(task.task_name, 8)} (
                      {task.task_state === "toDoList"
                        ? "to-do"
                        : task.task_state}
                      )
                    </span>
                  </li>
                ))}
              </div>
            ))}
          </div>
      

          {app.tasks?.map((task) => (
            <div
              className="mx-3 d-flex justify-content-between"
              onClick={handleTaskClick}
              key={task.task_id}
            >
              <span className={styles.listItem} id={task.task_id}>
                {truncateCharacters(task.task_name, 10)} (
                {task.task_state === "toDoList" ? "to-do" : task.task_state})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppDropList;
