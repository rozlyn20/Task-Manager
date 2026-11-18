import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AutoAwesome, CalendarMonth, CheckCircleOutline, EventNote, RestartAlt } from "@mui/icons-material";
import Sidebar from "../../components/sidebar/Sidebar";
import { API_BASE_URL } from "../../config";
import "./aiPlanner.scss";

const AiPlanner = () => {
  const navigate = useNavigate();
  const [goal, setGoal] = useState("");
  const [weeks, setWeeks] = useState(4);
  const [hoursPerWeek, setHoursPerWeek] = useState(5);
  const [experience, setExperience] = useState("beginner");
  const [plan, setPlan] = useState(null);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, [navigate]);

  const items = useMemo(() => plan ? [
    ...plan.monthlyMilestones.map((task, index) => ({ ...task, id: `milestone-${index}`, group: "milestone" })),
    ...plan.weeklyTasks.map((task, index) => ({ ...task, id: `weekly-${index}`, group: "weekly" }))
  ] : [], [plan]);
  const selectedCount = items.filter((task) => selected[task.id] !== false).length;

  const generatePlan = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/ai/plan`, {
        goal, weeks: Number(weeks), hoursPerWeek: Number(hoursPerWeek), experience
      }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      setPlan(data);
      setSelected(Object.fromEntries([...data.monthlyMilestones.map((_, i) => [`milestone-${i}`, true]), ...data.weeklyTasks.map((_, i) => [`weekly-${i}`, true])]));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "We couldn't make your plan. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = (id, field, value) => {
    setPlan((current) => ({
      ...current,
      monthlyMilestones: current.monthlyMilestones.map((task, index) => id === `milestone-${index}` ? { ...task, [field]: value } : task),
      weeklyTasks: current.weeklyTasks.map((task, index) => id === `weekly-${index}` ? { ...task, [field]: value } : task)
    }));
  };

  const addSelectedTasks = async () => {
    const chosen = items.filter((task) => selected[task.id] !== false);
    if (!chosen.length) return;
    setSaving(true);
    setError("");
    try {
      await axios.post(`${API_BASE_URL}/api/tasks/bulk`, {
        tasks: chosen.map(({ title, description, dueDate }) => ({ title, description, dueDate, category: "Personal" }))
      }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      setNotice(`${chosen.length} ${chosen.length === 1 ? "task" : "tasks"} added to your task list.`);
      setPlan(null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "We couldn't add these tasks. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const renderTasks = (tasks, group) => tasks.length > 0 ? (
    <div className="planner-task-list">
      {tasks.map((task, index) => {
        const id = `${group}-${index}`;
        return <article className={`planner-task ${selected[id] === false ? "is-unselected" : ""}`} key={id}>
          <label className="planner-task-check" aria-label={`Include ${task.title}`}>
            <input type="checkbox" checked={selected[id] !== false} onChange={(event) => setSelected((current) => ({ ...current, [id]: event.target.checked }))} />
            <CheckCircleOutline />
          </label>
          <div className="planner-task-content">
            <input className="planner-task-title" aria-label="Task title" value={task.title} onChange={(event) => updateTask(id, "title", event.target.value)} />
            <textarea aria-label="Task description" value={task.description} onChange={(event) => updateTask(id, "description", event.target.value)} rows="2" />
            <label className="planner-date"><CalendarMonth fontSize="small" /><span>Due</span><input type="date" value={task.dueDate} onChange={(event) => updateTask(id, "dueDate", event.target.value)} /></label>
          </div>
          {group === "weekly" && <span className="planner-week-label">Week {task.week || index + 1}</span>}
        </article>;
      })}
    </div>
  ) : <p className="planner-no-items">No milestones for this plan.</p>;

  return <div className="ai-planner-page">
    <Sidebar />
    <main className="ai-planner-main">
      <header className="planner-heading">
        <div><span className="planner-eyebrow"><AutoAwesome /> PLAN WITH AI</span><h1>Turn a goal into a plan</h1><p>Tell us what you want to learn or achieve. Gemini will map it into monthly milestones and weekly steps.</p></div>
      </header>

      <form className="planner-form" onSubmit={generatePlan}>
        <label className="planner-goal-label" htmlFor="planner-goal">What would you like to accomplish?</label>
        <textarea id="planner-goal" value={goal} onChange={(event) => setGoal(event.target.value)} maxLength="500" required placeholder="For example: Prepare for a software engineering exam, or understand React well enough to build a small app…" />
        <div className="planner-options">
          <label>Plan length<select value={weeks} onChange={(event) => setWeeks(event.target.value)}>{[2, 4, 6, 8, 10, 12].map((value) => <option key={value} value={value}>{value} weeks</option>)}</select></label>
          <label>Time available<select value={hoursPerWeek} onChange={(event) => setHoursPerWeek(event.target.value)}>{[2, 5, 8, 10, 15, 20, 30, 40].map((value) => <option key={value} value={value}>{value} hours / week</option>)}</select></label>
          <label>Starting level<select value={experience} onChange={(event) => setExperience(event.target.value)}><option value="beginner">Beginner</option><option value="some experience">Some experience</option><option value="experienced">Experienced</option></select></label>
        </div>
        <div className="planner-form-footer"><span>Plans are tailored to your time and experience.</span><button type="submit" disabled={loading || !goal.trim()}><AutoAwesome />{loading ? "Building your plan…" : "Generate plan"}</button></div>
      </form>

      {error && <div className="planner-message planner-error" role="alert">{error}</div>}
      {notice && <div className="planner-message planner-success" role="status">{notice}</div>}

      {plan && <section className="planner-results" aria-live="polite">
        <div className="planner-results-heading"><div><span className="planner-eyebrow"><EventNote /> YOUR DRAFT PLAN</span><h2>{plan.title}</h2><p>{plan.summary}</p></div><button className="planner-reset" onClick={() => setPlan(null)} type="button"><RestartAlt /> Start over</button></div>
        <div className="planner-plan-section"><h3><CalendarMonth /> Monthly milestones</h3>{renderTasks(plan.monthlyMilestones, "milestone")}</div>
        <div className="planner-plan-section"><h3><CheckCircleOutline /> Weekly tasks</h3>{renderTasks(plan.weeklyTasks, "weekly")}</div>
        <div className="planner-save-bar"><span>{selectedCount} of {items.length} tasks selected</span><button type="button" onClick={addSelectedTasks} disabled={saving || selectedCount === 0}>{saving ? "Adding tasks…" : `Add ${selectedCount} to task list`}</button></div>
      </section>}
    </main>
  </div>;
};

export default AiPlanner;