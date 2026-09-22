import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./tomorrow.scss";
import { EventAvailable, NavigateNext, TodayOutlined } from "@mui/icons-material";
import New from "../NewModal/New";
import { API_BASE_URL } from "../../config";

const Tomorrow = () => {
  const [openTask, setOpenTask] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

const tomorrowTasks = tasks.filter((task) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const taskDate = new Date(task.dueDate);

  return (
    taskDate.getDate() === tomorrow.getDate() &&
    taskDate.getMonth() === tomorrow.getMonth() &&
    taskDate.getFullYear() === tomorrow.getFullYear()
  );
});

useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
        navigate("/login");
    }

}, [navigate]);
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

        const response = await axios.get(
            `${API_BASE_URL}/api/tasks`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

      setTasks(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const deleteTask = async (id) => {
    try {
       const token = localStorage.getItem("token");

    await axios.delete(
      `${API_BASE_URL}/api/tasks/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

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
      const token = localStorage.getItem("token");

    await axios.put(
      `${API_BASE_URL}/api/tasks/${task._id}`,
      {
        completed: !task.completed,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

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
      <p className="title"> Tomorrow </p>

      {loading ? (
        <div className="app-loading-state">
          <span className="app-spinner"></span>
          <span>Loading tomorrow's tasks…</span>
        </div>
      ) : tomorrowTasks.length === 0 ? (
        <div className="app-empty-state">
          <span className="app-empty-icon">
            <EventAvailable />
          </span>
          <p className="app-empty-title">Nothing scheduled for tomorrow</p>
          <p className="app-empty-subtitle">Tasks due tomorrow will show up here.</p>
        </div>
      ) : (
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
        {tomorrowTasks.map((task) => (
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
      )}
      {showEditor && (
        <New onClose={handleCloseEditor} fetchTasks={fetchTasks} task={selectedTask}/>
      )}
    </div>
  );
};

export default Tomorrow;
