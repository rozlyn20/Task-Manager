import React from "react";
import "./new.scss";
import { Add } from "@mui/icons-material";
import { useState ,useEffect} from "react";
import axios from "axios";

const New = ({ onClose, fetchTasks, task   }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Personal");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
  if (task) {
    setTitle(task.title || "");
    setDescription(task.description || "");
    setCategory(task.category || "Personal");

    if (task.dueDate) {
      setDueDate(task.dueDate.split("T")[0]);
    }
  }
}, [task]);

  const saveTask = async () => {
  try {

    if (task) {

      await axios.put(
        `http://localhost:5000/api/tasks/${task._id}`,
        {
          title,
          description,
          category,
          dueDate
        }
      );

    } else {

      await axios.post(
        "http://localhost:5000/api/tasks",
        {
          title,
          description,
          category,
          dueDate
        }
      );

    }

    fetchTasks();
    onClose();

  } catch (error) {
    console.log(error);
  }
};
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>{task ? "Edit Task" : "Add New Task"}</h2>
        <div className="new">
          <div className="top">
            <p className="title">Task</p>
            <input
              type="text"
              placeholder="Enter a Task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="center">
            <ul>
              <li>
                <p>Category</p>
                <select
                  name="list"
                  id="list"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Personal">Personal</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </li>
              <li>
                <p>Due date</p>
                <input
                  type="date"
                  name="due-date"
                  id="due-date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </li>
              <li>
                <p>Tags</p>
                <div className="tags">
                  <select
                    multiple
                    value=""
                    className="native-multi-select"
                    style={{
                      width: "100%",
                      height: "100px",
                      padding: "8px",
                      border: "1px solid #ccc",
                      boderRadius: "4px",
                      fontSize: "14px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <option value="1">Urgent</option>
                    <option value="2">Important</option>
                    <option value="3">Optional</option>
                  </select>
                  <div
                    style={{
                      marginTop: "8px",
                      fontSize: "14px",
                      color: "#555",
                    }}
                  >
                    <strong>Selected: </strong>
                    Urgent,Important
                  </div>
                </div>
                <p
                  className="note"
                  style={{
                    marginTop: "8px",
                  }}
                >
                  <strong>Note: </strong> You can select multiple tags by by
                  holdong trl(cmd on mac). Want to add new tag? Go to the
                  sidebar
                </p>
              </li>
            </ul>
            <div className="subtasks">
              <p className="sub">Subtasks: </p>
              <ul>
                <li>
                  <input type="text" placeholder="Subtask 1" />
                </li>
                <li>
                  <input type="text" placeholder="Subtask 2" />
                </li>
                <li className="add-subtask">
                  <Add className="icon" />
                  <span> Add New Subtask</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bottom">
            <button className="cancel" onClick={onClose}>
              {" "}
              Cancel
            </button>
            <button className="delete"> Delete</button>
            <button className="save" onClick={saveTask}>
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
