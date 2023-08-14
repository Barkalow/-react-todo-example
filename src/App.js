import Form from "./components/Form";
import Todo from "./components/Todo";
import FilterButton from "./components/FilterButton";
import React, { useState } from "react";
import { nanoid } from "nanoid";
  
const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState("All");

  const tasksNoun = incompleteTasks() !== 1 ? "tasks" : "task";

  function addTask(name) {
    const newTask = { id: `todo-${nanoid()}`, name, completed: false };
    setTasks([...tasks, newTask]);
  }  

  function deleteTask(id) {
    let updatedTasks = tasks.filter((task) => {
      return task.id !== id;
    });
    setTasks(updatedTasks);
  }  

  function doTaskAction(id, taskAction, values){
    let updatedTasks = tasks.map((task) => {
      if(task.id === id){
        return taskAction(task, values);
      }

      return task;
    });

    setTasks(updatedTasks);
  }

  function toggleTaskCompleted(id) {
    doTaskAction(id, setTaskCompleted);
  }

  function setTaskCompleted(task){
    return {...task, completed: !task.completed};
  }

  function editTask(id, values) {
    doTaskAction(id, setTaskName, values);
  }  

  function setTaskName(task, values){
    return { ...task, name: values?.newValue };
  }

  function incompleteTasks(){
    return tasks.filter(task => {
      return !task.completed;
    })?.length;
  }

  
  const buttonList = FILTER_NAMES.map((name) => (
    <FilterButton
      label={name}
      key={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));
  
  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
  ));

  const appForm = (
    <Form
      label="What needs to be done?"
      addTask={addTask}
    />
  );

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      {appForm}
      <div className="filters btn-group stack-exception">
      {buttonList}
      </div>
      <h2 id="list-heading">{incompleteTasks()} {tasksNoun} remaining</h2>
      <ul
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {taskList}
      </ul>
    </div>
  );
} 

export default App;
