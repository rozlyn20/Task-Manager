import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./habits.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import NewHabit from "../../components/NewHabitModal/NewHabit";
import { ContributionHeatmap } from "../../components/charts/Heatmap";
import {
  Add,
  Check,
  EditOutlined,
  LocalFireDepartmentOutlined,
  RepeatOutlined,
} from "@mui/icons-material";
import {
  buildHeatmapWeeks,
  computeStreaks,
  isLoggedOn,
  isScheduledDay,
  localDateKey,
  utcDateKeyFromLog,
  WEEKDAY_SHORT,
} from "../../utils/habitStats";

const frequencyLabel = (habit) => {
  if (habit.frequency !== "Weekly") return "Every day";
  if (!habit.daysOfWeek || habit.daysOfWeek.length === 0) return "Weekly";
  if (habit.daysOfWeek.length === 7) return "Every day";
  return habit.daysOfWeek
    .slice()
    .sort()
    .map((d) => WEEKDAY_SHORT[d])
    .join(" ");
};

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/habits`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHabits(response.data);
    } catch (err) {
      console.log(err);
      setError("Couldn't load your habits. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleToday = async (habit) => {
    const todayKey = localDateKey(new Date());
    const alreadyLogged = isLoggedOn(habit, todayKey);
    const previousHabits = habits;

    // Optimistic update: flip today's entry locally first. The new entry is
    // built as UTC midnight of todayKey (not "right now") so it matches
    // exactly what the server will store — see toUTCDateOnly in
    // backend/routes/habitRoutes.js. Using the current instant instead would
    // mismatch for users whose local day has already rolled over ahead of UTC.
    setHabits((prev) =>
      prev.map((h) => {
        if (h._id !== habit._id) return h;
        const logs = alreadyLogged
          ? h.logs.filter((log) => utcDateKeyFromLog(log) !== todayKey)
          : [...h.logs, new Date(todayKey).toISOString()];
        return { ...h, logs };
      })
    );

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/habits/${habit._id}/toggle`,
        { date: todayKey },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHabits((prev) => prev.map((h) => (h._id === habit._id ? response.data : h)));
    } catch (err) {
      console.log(err);
      setHabits(previousHabits);
      setError("Couldn't update that habit. Please try again.");
    }
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setSelectedHabit(null);
  };

  const today = new Date();
  const todayKey = localDateKey(today);

  return (
    <div className="habits">
      <Sidebar />
      <div className="habitsContainer">
        <div className="habits-header">
          <p className="title">Habits</p>
          <button className="add-habit-btn" onClick={() => setShowEditor(true)}>
            <Add fontSize="small" />
            <span>Add Habit</span>
          </button>
        </div>

        {error && <div className="habits-error">{error}</div>}

        {loading ? (
          <div className="app-loading-state">
            <span className="app-spinner"></span>
            <span>Loading your habits…</span>
          </div>
        ) : habits.length === 0 ? (
          <div className="app-empty-state">
            <span className="app-empty-icon">
              <RepeatOutlined />
            </span>
            <p className="app-empty-title">No habits yet</p>
            <p className="app-empty-subtitle">
              Add a habit to start building a streak — daily or on specific days.
            </p>
          </div>
        ) : (
          <div className="habit-list">
            {habits.map((habit) => {
              const { current, longest } = computeStreaks(habit);
              const scheduledToday = isScheduledDay(habit, today);
              const doneToday = isLoggedOn(habit, todayKey);
              const weeks = buildHeatmapWeeks(habit, 12);

              return (
                <div className="habit-card" key={habit._id}>
                  <div className="habit-card-top">
                    <span className="habit-color" style={{ backgroundColor: habit.color }}></span>
                    <div className="habit-info">
                      <p className="habit-title">{habit.title}</p>
                      <p className="habit-frequency">{frequencyLabel(habit)}</p>
                    </div>
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setSelectedHabit(habit);
                        setShowEditor(true);
                      }}
                    >
                      <EditOutlined fontSize="small" />
                    </button>
                  </div>

                  <div className="habit-streaks">
                    <span className="streak-pill">
                      <LocalFireDepartmentOutlined fontSize="small" />
                      {current} day{current === 1 ? "" : "s"} streak
                    </span>
                    <span className="streak-pill muted">Best: {longest}</span>
                  </div>

                  <div className="habit-bottom">
                    <ContributionHeatmap weeks={weeks} color={habit.color} />

                    <button
                      className={`today-toggle ${doneToday ? "done" : ""}`}
                      disabled={!scheduledToday}
                      onClick={() => toggleToday(habit)}
                      style={doneToday ? { backgroundColor: habit.color, borderColor: habit.color } : {}}
                    >
                      {doneToday ? <Check fontSize="small" /> : null}
                      {!scheduledToday ? "Not scheduled today" : doneToday ? "Done today" : "Mark done"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showEditor && (
          <NewHabit onClose={handleCloseEditor} fetchHabits={fetchHabits} habit={selectedHabit} />
        )}
      </div>
    </div>
  );
};

export default Habits;
