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
const upcomingTasks = tasks.filter((task) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskDate = new Date(task.dueDate);
  taskDate.setHours(0, 0, 0, 0);

  const threeDaysLater = new Date(today);
  threeDaysLater.setDate(today.getDate() + 3);

  return taskDate >= today && taskDate <= threeDaysLater;
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
  <h3>Upcoming Tasks</h3>

  {loading ? (
    <div className="app-loading-state">
      <span className="app-spinner"></span>
      <span>Loading your tasks…</span>
    </div>
  ) : upcomingTasks.length === 0 ? (
    <div className="app-empty-state">
      <span className="app-empty-icon">
        <EventAvailable />
      </span>
      <p className="app-empty-title">No upcoming tasks</p>
      <p className="app-empty-subtitle">Tasks due in the next 3 days will appear here.</p>
    </div>
  ) : (
    <ul>
      {upcomingTasks.map((task) => (
        <li key={task._id}>
          <span>{task.title}</span>

          <small>
            {new Date(task.dueDate).toLocaleDateString()}
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
