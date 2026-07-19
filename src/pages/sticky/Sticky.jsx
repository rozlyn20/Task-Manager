import React, { useState, useEffect } from "react";
import "./sticky.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import StickyNote from "../../components/StickyNote/StickyNote";
import StickyModal from "../../components/StickyModal/StickyModal";
import { Add } from "@mui/icons-material";
import axios from "axios";


const Sticky = () => {
  const [wall, setWall] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const fetchStickies = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/sticky`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setWall(res.data);

  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
      fetchStickies();
}, []);
  const openAddModal = () => {
    setEditingNote(null);
    setModalOpen(true);
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  const handleSubmit = async (data) => {
  try {
    const token = localStorage.getItem("token");

    if (editingNote) {

      await axios.put(
        `${process.env.REACT_APP_API_URL}api/sticky/${editingNote._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    } else {

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/sticky`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    }

    fetchStickies();
    closeModal();

  } catch (error) {
    console.log(error);
  }
};
const handleDelete = async (id) => {

  if (!window.confirm("Delete this sticky note?"))
    return;

  try {

    const token = localStorage.getItem("token");

    await axios.delete(
      `${process.env.REACT_APP_API_URL}/api/sticky/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchStickies();

  } catch (error) {
    console.log(error);
  }

};
  const handleSummarize = async (id, content) => {
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/ai/summarize`,
            {
                content,
            }
        );

        setWall((prev) =>
            prev.map((note) =>
                note._id === id
                    ? { ...note, summary: res.data.summary }
                    : note
            )
        );

    } catch (error) {
        console.error(error);
        alert("Failed to summarize note.");
    }
};
  return (
    <div className="sticky">
      <Sidebar />
      <div className="stickyContainer">
        <p className="title"> Sticky Wall </p>

        <div className="row">
          {wall.map((note) => (
            <StickyNote
              key={note._id}
              title={note.title}
              content={note.content}
              color={note.color}
              summary={note.summary}
              onSummarize={() => handleSummarize(note._id,note.content)}
              onEdit={() => openEditModal(note)}
              onDelete={() => handleDelete(note._id)}
            />
          ))}
          <div
            className="stickyNote addNote"
            onClick={openAddModal}
            style={{ cursor: "pointer", backgroundColor: "lightgrey" }}
          >
            <Add className="icon" />
          </div>
        </div>
        <StickyModal
          open={modalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
          initialData={editingNote}
        />
      </div>
    </div>
  );
};

export default Sticky;
