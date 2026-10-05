import React, { useState, useEffect } from "react";
import axios from "axios";
import "./newHabit.scss";
import { WEEKDAY_SHORT } from "../../utils/habitStats";

const COLOR_OPTIONS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899"];

const NewHabit = ({ onClose, fetchHabits, habit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (habit) {
      setTitle(habit.title || "");
      setDescription(habit.description || "");
      setFrequency(habit.frequency || "Daily");
      setDaysOfWeek(Array.isArray(habit.daysOfWeek) ? habit.daysOfWeek : []);
      setColor(habit.color || COLOR_OPTIONS[0]);
    }
  }, [habit]);

  const toggleDay = (dayIndex) => {
    setDaysOfWeek((prev) =>
      prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex].sort()
    );
  };

  const saveHabit = async () => {
    if (!title.trim()) {
      setError("Give your habit a name first.");
      return;
    }
    if (frequency === "Weekly" && daysOfWeek.length === 0) {
      setError("Pick at least one day of the week.");
      return;
    }

    setError("");
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const payload = { title, description, frequency, daysOfWeek, color };

      if (habit) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/habits/${habit._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/habits`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      fetchHabits();
      onClose();
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Couldn't save this habit. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const deleteHabit = async () => {
    if (!habit) return;
    if (!window.confirm("Delete this habit? Its history will be lost.")) return;

    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/habits/${habit._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchHabits();
      onClose();
    } catch (err) {
      console.log(err);
      setError("Couldn't delete this habit. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="habit-modal-overlay" onClick={onClose}>
      <div className="habit-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>{habit ? "Edit habit" : "New habit"}</h2>

        <div className="field">
          <label>Name</label>
          <input
            type="text"
            placeholder="e.g. Read for 20 minutes"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Description (optional)</label>
          <textarea
            placeholder="Any notes about this habit"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Frequency</label>
          <div className="frequency-toggle">
            <button
              type="button"
              className={frequency === "Daily" ? "active" : ""}
              onClick={() => setFrequency("Daily")}
            >
              Every day
            </button>
            <button
              type="button"
              className={frequency === "Weekly" ? "active" : ""}
              onClick={() => setFrequency("Weekly")}
            >
              Specific days
            </button>
          </div>
        </div>

        {frequency === "Weekly" && (
          <div className="field">
            <label>Which days?</label>
            <div className="weekday-picker">
              {WEEKDAY_SHORT.map((label, idx) => (
                <button
                  type="button"
                  key={idx}
                  className={daysOfWeek.includes(idx) ? "day active" : "day"}
                  onClick={() => toggleDay(idx)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="field">
          <label>Color</label>
          <div className="color-picker">
            {COLOR_OPTIONS.map((c) => (
              <button
                type="button"
                key={c}
                className={color === c ? "swatch active" : "swatch"}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>

        {error && <div className="habit-form-error">{error}</div>}

        <div className="bottom">
          {habit && (
            <button className="delete" onClick={deleteHabit} disabled={deleting}>
              {deleting ? "Deleting…" : "Delete"}
            </button>
          )}
          <button className="cancel" onClick={onClose}>Cancel</button>
          <button className="save" onClick={saveHabit} disabled={saving}>
            {saving ? "Saving…" : "Save habit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewHabit;
