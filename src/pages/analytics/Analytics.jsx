import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./analytics.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import { DonutChart, BarChart, TrendLineChart } from "../../components/charts/Charts";
import {
  AssignmentTurnedInOutlined,
  ErrorOutline,
  EventBusyOutlined,
  HourglassEmptyOutlined,
  InsightsOutlined,
  PendingActionsOutlined,
  TaskAltOutlined,
  UpcomingOutlined,
} from "@mui/icons-material";

const TREND_DAYS = 14;

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const normalizeStatus = (task) =>
  ["To Do", "In Progress", "Done"].includes(task.status) ? task.status : "To Do";

const Analytics = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
    setLoading(true);
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
      setError("Couldn't load your analytics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---- Derived, real-data metrics (no mock data) -------------------------
  const today = startOfDay(new Date());

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const inProgress = tasks.filter(
    (t) => !t.completed && normalizeStatus(t) === "In Progress"
  ).length;
  const pending = Math.max(0, total - completed - inProgress);
  const completionRate = total ? Math.round((completed / total) * 100) : 0;

  const overdueTasks = tasks
    .filter((t) => !t.completed && t.dueDate && startOfDay(t.dueDate) < today)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const sevenDaysOut = new Date(today);
  sevenDaysOut.setDate(sevenDaysOut.getDate() + 7);

  const upcomingTasks = tasks
    .filter(
      (t) =>
        !t.completed &&
        t.dueDate &&
        startOfDay(t.dueDate) >= today &&
        startOfDay(t.dueDate) <= sevenDaysOut
    )
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const statusData = [
    { label: "To Do", value: pending, color: "#9ca3af" },
    { label: "In Progress", value: inProgress, color: "#f59e0b" },
    { label: "Done", value: completed, color: "#10b981" },
  ];

  const categoryCounts = { Personal: 0, Work: 0, Other: 0 };
  tasks.forEach((t) => {
    if (categoryCounts[t.category] !== undefined) categoryCounts[t.category] += 1;
    else categoryCounts.Other += 1;
  });
  const categoryData = [
    { label: "Personal", value: categoryCounts.Personal, color: "#e74c3c" },
    { label: "Work", value: categoryCounts.Work, color: "#3498db" },
    { label: "Other", value: categoryCounts.Other, color: "#f1c40f" },
  ];

  // Completion-over-time: count completed tasks per day for the last N days,
  // using each task's updatedAt as a proxy for "when it was marked complete".
  const trendData = [];
  for (let i = TREND_DAYS - 1; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(day.getDate() - i);
    const dayEnd = new Date(day);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const count = tasks.filter((t) => {
      if (!t.completed || !t.updatedAt) return false;
      const updated = new Date(t.updatedAt);
      return updated >= day && updated < dayEnd;
    }).length;

    trendData.push({
      label: day.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      value: count,
    });
  }

  const summaryCards = [
    { label: "Total tasks", value: total, icon: <InsightsOutlined />, tone: "primary" },
    { label: "Completed", value: completed, icon: <TaskAltOutlined />, tone: "success" },
    { label: "In progress", value: inProgress, icon: <PendingActionsOutlined />, tone: "warning" },
    { label: "Pending", value: pending, icon: <HourglassEmptyOutlined />, tone: "neutral" },
  ];

  return (
    <div className="analytics">
      <Sidebar />
      <div className="analyticsContainer">
        <p className="title">Analytics</p>

        {loading ? (
          <div className="app-loading-state">
            <span className="app-spinner"></span>
            <span>Crunching your task data…</span>
          </div>
        ) : error ? (
          <div className="analytics-error">
            <ErrorOutline />
            <p>{error}</p>
            <button onClick={fetchTasks}>Retry</button>
          </div>
        ) : total === 0 ? (
          <div className="app-empty-state">
            <span className="app-empty-icon">
              <InsightsOutlined />
            </span>
            <p className="app-empty-title">Nothing to analyze yet</p>
            <p className="app-empty-subtitle">
              Add a few tasks and your stats, charts and trends will show up here.
            </p>
          </div>
        ) : (
          <>
            {/* ---- Summary cards ---- */}
            <div className="summary-grid">
              {summaryCards.map((c) => (
                <div className={`summary-card tone-${c.tone}`} key={c.label}>
                  <span className="summary-icon">{c.icon}</span>
                  <div>
                    <p className="summary-value">{c.value}</p>
                    <p className="summary-label">{c.label}</p>
                  </div>
                </div>
              ))}
              <div className="summary-card tone-rate">
                <span className="summary-icon">
                  <AssignmentTurnedInOutlined />
                </span>
                <div>
                  <p className="summary-value">{completionRate}%</p>
                  <p className="summary-label">Completion rate</p>
                </div>
              </div>
            </div>

            {/* ---- Charts ---- */}
            <div className="charts-grid">
              <div className="chart-card">
                <h3>Tasks by status</h3>
                <DonutChart data={statusData} />
              </div>
              <div className="chart-card">
                <h3>Tasks by category</h3>
                <BarChart data={categoryData} />
              </div>
              <div className="chart-card chart-card-wide">
                <h3>Completion over the last {TREND_DAYS} days</h3>
                <TrendLineChart data={trendData} />
              </div>
            </div>

            {/* ---- Overdue / Upcoming ---- */}
            <div className="lists-grid">
              <div className="list-card">
                <h3>
                  <EventBusyOutlined className="heading-icon overdue" />
                  Overdue <span className="count">{overdueTasks.length}</span>
                </h3>
                {overdueTasks.length === 0 ? (
                  <p className="list-empty">Nothing overdue — you're all caught up.</p>
                ) : (
                  <ul>
                    {overdueTasks.slice(0, 6).map((t) => (
                      <li key={t._id}>
                        <span className="task-title">{t.title}</span>
                        <span className="task-date overdue">
                          {new Date(t.dueDate).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="list-card">
                <h3>
                  <UpcomingOutlined className="heading-icon upcoming" />
                  Upcoming (7 days) <span className="count">{upcomingTasks.length}</span>
                </h3>
                {upcomingTasks.length === 0 ? (
                  <p className="list-empty">Nothing due in the next 7 days.</p>
                ) : (
                  <ul>
                    {upcomingTasks.slice(0, 6).map((t) => (
                      <li key={t._id}>
                        <span className="task-title">{t.title}</span>
                        <span className="task-date">
                          {new Date(t.dueDate).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
