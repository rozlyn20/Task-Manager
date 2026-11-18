import React from "react";
import "./home.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import New from "../../components/NewModal/New";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Add, EventAvailable } from "@mui/icons-material";
import { API_BASE_URL } from "../../config";

const Home = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
const getDueDate = (task) => task.dueDate
  ? new Date(`${String(task.dueDate).slice(0, 10)}T00:00:00`)
  : null;

const topTasks = tasks
  .filter((task) => !task.completed && task.status !== "Done")
  .sort((a, b) => {
    const dateA = getDueDate(a);
    const dateB = getDueDate(b);
    if (dateA && dateB) return dateA - dateB;
    if (dateA) return -1;
    if (dateB) return 1;
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  })
  .slice(0, 5);
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

  const toggleComplete = async (task) => {
    const nextCompleted = !task.completed;
    setTasks((current) => current.map((item) => item._id === task._id
      ? { ...item, completed: nextCompleted, status: nextCompleted ? "Done" : "To Do" }
      : item));
    try {
      await axios.put(`${API_BASE_URL}/api/tasks/${task._id}`, {
        completed: nextCompleted,
        status: nextCompleted ? "Done" : "To Do"
      }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
    } catch (error) {
      setTasks((current) => current.map((item) => item._id === task._id ? task : item));
      console.log(error);
    }
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setSelectedTask(null);
  };

  return (
    <div className="home">
      <Sidebar />
      <div className="homecontainer">
        <div className="upcoming-title">
          <p> Home</p>
        </div>
          <ul>
          <li
            className="add-task-row"
            onClick={() => {
              setShowEditor(true);
            }}
          >
            <Add />
            <span>Add New Task</span>
          </li>
        </ul>
        {showEditor && (
          <New
            onClose={handleCloseEditor}
            fetchTasks={fetchTasks}
            task={selectedTask}
          />
        )}
        <div className="upcoming-section">
  <h3>Top 5 Tasks to Do</h3>

  {loading ? (
    <div className="app-loading-state">
      <span className="app-spinner"></span>
      <span>Loading your tasks…</span>
    </div>
  ) : topTasks.length === 0 ? (
    <div className="app-empty-state">
      <span className="app-empty-icon">
        <EventAvailable />
      </span>
      <p className="app-empty-title">You're all caught up</p>
      <p className="app-empty-subtitle">Your unfinished tasks will show up here.</p>
    </div>
  ) : (
    <ul className="home-task-list">
      {topTasks.map((task) => (
        <li key={task._id}>
          <input
            className="home-task-checkbox"
            type="checkbox"
            checked={Boolean(task.completed)}
            aria-label={`Mark ${task.title} ${task.completed ? "incomplete" : "complete"}`}
            onChange={() => toggleComplete(task)}
          />
          <span>{task.title}</span>

          <small>
            {getDueDate(task)
              ? `Due ${getDueDate(task).toLocaleDateString()}`
              : "No due date"}
          </small>
        </li>
      ))}
    </ul>
  )}
</div>
      </div>
    </div>
  );
};

export default Home;
