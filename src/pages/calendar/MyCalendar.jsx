import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./calendar.scss";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addDays } from "date-fns";
import enUS from "date-fns/locale/en-US";
import axios from "axios";
import New from "../../components/NewModal/New";
import { useEffect } from "react";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const MyCalendar = () => {
  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showEditor, setShowEditor] = useState(false);
const [selectedDate, setSelectedDate] = useState(null);
  const [currentView, setCurrentView] = useState(Views.MONTH);
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
  const events = tasks.map((task) => ({
    title: task.title,
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    allDay: true,
    taskData: task,
  }));

 const handleSelectSlot = ({ start }) => {
  setSelectedDate(start);
  setShowEditor(true);
};
  const handleSelectEvent = (event) => {
    const task = event.taskData;

    alert(
      `Task: ${task.title}
Category: ${task.category}
Due Date: ${task.dueDate}`,
    );
  };
  return (
    <div className="calendar">
      <Sidebar />
      <div className="mycalendar" style={{ padding: "20px" }}>
        <h1>Calendar</h1>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          style={{ height: 500 }}
          views={["month", "week", "day", "agenda"]}
          view={currentView}
          onView={setCurrentView}
          onNavigate={setDate}
          date={date}
        />
        {showEditor && (
  <New
    onClose={() => setShowEditor(false)}
    fetchTasks={fetchTasks}
    selectedDate={selectedDate}
  />
)}
        
      </div>
      
    </div>
  );
};

export default MyCalendar;
