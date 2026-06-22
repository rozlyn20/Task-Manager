import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

import "./today.scss";
import { Add, NavigateNext, TodayOutlined } from "@mui/icons-material";
import New from "../NewModal/New";

const Today = () => {
  const [openTask, setOpenTask] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [tasks, setTasks] = useState([]);
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

  const handleCloseEditor = () => {
    setShowEditor(false);
  };

  const toggleDetails = (id) => {
    setOpenTask(openTask === id ? null : id);
  };

  return (
    <div className="today">
      <p className="title"> Today </p>
      <ul>
        <li
          style={{ border: "1px solid #e6e6e6" }}
          onClick={() => {
            setShowEditor(true);
          }}
        >
          <Add />
          <span style={{ marginLeft: "10px" }}>Add New Task</span>
        </li>
        {tasks.map((task) => (
          <li key={task._id}>
            <input type="checkbox" id={task._id} />
            <label>
              {task.title}
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
                </div>
              )}
            </label>
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
        <New onClose={handleCloseEditor} fetchTasks={fetchTasks} />
      )}
    </div>
  );
};

export default Today;
