import React from "react";
import "./home.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import New from "../../components/NewModal/New";
import axios from "axios";
import { useEffect, useState } from "react";
import { Add } from "@mui/icons-material";

const Home = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const upcomingTasks = tasks.filter((task) => {
  const today = new Date();

  const taskDate = new Date(task.dueDate);

  const threeDaysLater = new Date();
  threeDaysLater.setDate(today.getDate() + 3);

  return (
    taskDate >= today &&
    taskDate <= threeDaysLater
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
            style={{ border: "1px solid #e6e6e6" }}
            onClick={() => {
              setShowEditor(true);
            }}
          >
            <Add />
            <span style={{ marginLeft: "10px" }}>Add New Task</span>
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

  {upcomingTasks.length === 0 ? (
    <p>No upcoming tasks</p>
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
