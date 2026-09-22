import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./kanban.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import New from "../../components/NewModal/New";
import {
  Add,
  DragIndicator,
  ErrorOutline,
  TodayOutlined,
  ViewKanbanOutlined,
} from "@mui/icons-material";

// The 3 Kanban columns. Any task whose status is missing/unrecognised
// (e.g. tasks created before this feature existed) safely falls back to "To Do".
const COLUMNS = [
  { key: "To Do", label: "To Do" },
  { key: "In Progress", label: "In Progress" },
  { key: "Done", label: "Done" },
];

const normalizeStatus = (task) =>
  COLUMNS.some((c) => c.key === task.status) ? task.status : "To Do";

const Kanban = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const draggedTaskId = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTasks = async () => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(response.data);
    } catch (err) {
      console.log(err);
      setError("Couldn't load your tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const columnsWithTasks = COLUMNS.map((col) => ({
    ...col,
    tasks: tasks.filter((t) => normalizeStatus(t) === col.key),
  }));

  const handleDragStart = (e, taskId) => {
    draggedTaskId.current = taskId;
    e.dataTransfer.effectAllowed = "move";
    // Needed for Firefox to allow the drag to start.
    e.dataTransfer.setData("text/plain", taskId);
  };

  const handleDragOver = (e, columnKey) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverColumn !== columnKey) setDragOverColumn(columnKey);
  };

  const handleDragLeave = (columnKey) => {
    setDragOverColumn((current) => (current === columnKey ? null : current));
  };

  const handleDrop = async (e, columnKey) => {
    e.preventDefault();
    setDragOverColumn(null);

    const taskId = draggedTaskId.current || e.dataTransfer.getData("text/plain");
    draggedTaskId.current = null;
    if (!taskId) return;

    const task = tasks.find((t) => t._id === taskId);
    if (!task || normalizeStatus(task) === columnKey) return;

    const previousTasks = tasks;
    const nextCompleted = columnKey === "Done";

    // Optimistic UI update so the drag feels instant.
    setTasks((prev) =>
      prev.map((t) =>
        t._id === taskId ? { ...t, status: columnKey, completed: nextCompleted } : t
      )
    );

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/tasks/${taskId}`,
        {
          status: columnKey,
          completed: nextCompleted,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
      // Roll back on failure and let the user know.
      setTasks(previousTasks);
      setError("Couldn't move that task. Please try again.");
    }
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setSelectedTask(null);
  };

  return (
    <div className="kanban">
      <Sidebar />
      <div className="kanbanContainer">
        <div className="board-header">
          <p className="title">Board</p>
          <button className="add-task-btn" onClick={() => setShowEditor(true)}>
            <Add fontSize="small" />
            <span>Add Task</span>
          </button>
        </div>

        {error && (
          <div className="board-error">
            <ErrorOutline fontSize="small" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="app-loading-state">
            <span className="app-spinner"></span>
            <span>Loading your board…</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="app-empty-state">
            <span className="app-empty-icon">
              <ViewKanbanOutlined />
            </span>
            <p className="app-empty-title">Your board is empty</p>
            <p className="app-empty-subtitle">
              Add a task to start tracking it through To Do, In Progress and Done.
            </p>
          </div>
        ) : (
          <div className="board">
            {columnsWithTasks.map((col) => (
              <div
                key={col.key}
                className={`column ${dragOverColumn === col.key ? "drag-over" : ""}`}
                onDragOver={(e) => handleDragOver(e, col.key)}
                onDragLeave={() => handleDragLeave(col.key)}
                onDrop={(e) => handleDrop(e, col.key)}
              >
                <div className="column-header">
                  <span className={`dot dot-${col.key.replace(/\s/g, "")}`}></span>
                  <span className="column-title">{col.label}</span>
                  <span className="column-count">{col.tasks.length}</span>
                </div>

                <div className="column-body">
                  {col.tasks.length === 0 ? (
                    <div className="column-empty">Drop tasks here</div>
                  ) : (
                    col.tasks.map((task) => (
                      <div
                        key={task._id}
                        className="kanban-card"
                        draggable
                        onDragStart={(e) => handleDragStart(e, task._id)}
                        onClick={() => {
                          setSelectedTask(task);
                          setShowEditor(true);
                        }}
                      >
                        <div className="card-top">
                          <span
                            className="category-color"
                            style={{
                              backgroundColor:
                                task.category === "Personal"
                                  ? "#e74c3c"
                                  : task.category === "Work"
                                    ? "#3498db"
                                    : "#f1c40f",
                            }}
                          ></span>
                          <span className="category-label">{task.category}</span>
                          <DragIndicator className="drag-handle" />
                        </div>
                        <p className="card-title">{task.title}</p>
                        {task.dueDate && (
                          <div className="card-due">
                            <TodayOutlined className="icon" />
                            <span>
                              {new Date(task.dueDate).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showEditor && (
          <New onClose={handleCloseEditor} fetchTasks={fetchTasks} task={selectedTask} />
        )}
      </div>
    </div>
  );
};

export default Kanban;
