import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import TaskItem from "./TaskItem";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";

const TaskContainer = (props) => {
  const { tasks, handleShowModal, updateTaskState } = props;
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
  }, [tasks]);

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
        <h3>Open</h3>
        {openTasksList}
      </Col>
      <Col>
        <h3>To-Dos</h3>
        {toDoTasksList}
      </Col>
      <Col>
        <h3>Doing</h3>
        {inProgressTasksList}
      </Col>
      <Col>
        <h3>Done</h3>
        {doneTasksList}
      </Col>
      <Col>
        <h3>Completed</h3>
        {completedTasksList}
      </Col>
    </Row>
  );
};
export default TaskContainer;
