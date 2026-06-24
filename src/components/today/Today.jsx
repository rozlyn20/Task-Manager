import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

import "./today.scss";
import { Add, NavigateNext, TodayOutlined } from "@mui/icons-material";
import New from "../NewModal/New";

const Today = () => {
  const [openTask, setOpenTask] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const todayTasks = tasks.filter((task) => {
  const today = new Date();

  const taskDate = new Date(task.dueDate);

  return (
    taskDate.getDate() === today.getDate() &&
    taskDate.getMonth() === today.getMonth() &&
    taskDate.getFullYear() === today.getFullYear()
  );
});

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks");

      setTasks(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);

      fetchTasks();

      if (openTask === id) {
        setOpenTask(null);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const toggleComplete = async (task) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${task._id}`, {
        completed: !task.completed,
      });

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };
  const handleCloseEditor = () => {
    setShowEditor(false);
    setSelectedTask(null);
  };

  const toggleDetails = (id) => {
    setOpenTask(openTask === id ? null : id);
  };

  return (
    <div className="today">
      <p className="title"> Today </p>
      <ul>
        {/* <li
          style={{ border: "1px solid #e6e6e6" }}
          onClick={() => {
            setShowEditor(true);
          }}
        >
          <Add />
          <span style={{ marginLeft: "10px" }}>Add New Task</span>
        </li> */}
        {todayTasks.map((task) => (
          <li key={task._id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task)}
            />
            <div className="task-content">
              <span
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                  opacity: task.completed ? 0.6 : 1,
                }}
              >
                {task.title}
              </span>
              {openTask === task._id && (
                <div className="details">
                  <div className="left">
                    <TodayOutlined className="icon" />
                    <p> {task.dueDate}</p>
                  </div>
                  <div className="center">
                    <span>2</span>
                    <p>Subtasks </p>
                  </div>
                  <div className="right">
                    <span
                      className="color"
                      style={{
                        backgroundColor:
                          task.category === "Personal"
                            ? "#e74c3c"
                            : task.category === "Work"
                              ? "#3498db"
                              : "#f1c40f",
                      }}
                    ></span>
                    <p>{task.category}</p>
                  </div>
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTask(task);
                        setShowEditor(true);
                      }}
                    >
                      Edit Task
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task._id);
                      }}
                      style={{
                        padding: "6px 12px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        backgroundColor: "#e74c3c",
                        color: "white",
                      }}
                    >
                      Delete Task
                    </button>
                  </div>
                </div>
              )}
            </div>
            <NavigateNext
              className={`icon ${openTask === task._id ? "rotate" : ""}`}
              onClick={(e) => {
                toggleDetails(task._id);
              }}
            />
          </li>
        ))}
      </ul>
      {showEditor && (
        <New onClose={handleCloseEditor} fetchTasks={fetchTasks} task={selectedTask}/>
      )}
    </div>
  );
};

export default Today;
