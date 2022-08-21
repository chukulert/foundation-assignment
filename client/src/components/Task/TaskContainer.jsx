import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import TaskItem from "./TaskItem";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { ApplicationContext } from "../../context/ApplicationContext";

const TaskContainer = (props) => {
  const { handleShowModal, updateTaskState, tasks } = props;
  const { selectedApplication } = useContext(ApplicationContext);
  const [openTasks, setOpenTasks] = useState([]);
  const [toDoTasks, setToDoTasks] = useState([]);
  const [progressTasks, setProgressTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    const openArr = tasks.filter((task) => {
      return task.task_state === "open";
    });

    const toDoArr = tasks.filter((task) => {
      return task.task_state === "toDoList";
    });

    const progressArr = tasks.filter((task) => {
      return task.task_state === "doing";
    });

    const doneArr = tasks.filter((task) => {
      return task.task_state === "done";
    });

    const completedArr = tasks.filter((task) => {
      return task.task_state === "close";
    });
    setOpenTasks(openArr);
    setToDoTasks(toDoArr);
    setProgressTasks(progressArr);
    setDoneTasks(doneArr);
    setCompletedTasks(completedArr);
    return () => {};
  }, [selectedApplication, tasks]);

  const openTasksList = openTasks.map((task) => (
    <TaskItem
      key={task.task_id}
      task={task}
      handleShowModal={handleShowModal}
      updateTaskState={updateTaskState}
    />
  ));

  const toDoTasksList = toDoTasks.map((task) => (
    <TaskItem
      key={task.task_id}
      task={task}
      handleShowModal={handleShowModal}
      updateTaskState={updateTaskState}
    />
  ));

  const inProgressTasksList = progressTasks.map((task) => (
    <TaskItem
      key={task.task_id}
      task={task}
      handleShowModal={handleShowModal}
      updateTaskState={updateTaskState}
    />
  ));

  const doneTasksList = doneTasks.map((task) => (
    <TaskItem
      key={task.task_id}
      task={task}
      handleShowModal={handleShowModal}
      updateTaskState={updateTaskState}
    />
  ));

  const completedTasksList = completedTasks.map((task) => (
    <TaskItem
      key={task.task_id}
      task={task}
      handleShowModal={handleShowModal}
      updateTaskState={updateTaskState}
    />
  ));

  return (
    <Row xs={5} md={5} lg={5}>
      <Col>
        <h5>Open</h5>
        {openTasksList}
      </Col>
      <Col>
        <h5>To-Dos</h5>
        {toDoTasksList}
      </Col>
      <Col>
        <h5>Doing</h5>
        {inProgressTasksList}
      </Col>
      <Col>
        <h5>Done</h5>
        {doneTasksList}
      </Col>
      <Col>
        <h5>Completed</h5>
        {completedTasksList}
      </Col>
    </Row>
  );
};
export default TaskContainer;
