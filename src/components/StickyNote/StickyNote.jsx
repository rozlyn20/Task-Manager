import React from "react";
import "./stickyNote.scss";
import { Delete, Edit } from "@mui/icons-material";

const StickyNote = ({
  title,
  content,
  color,
  summary,
  onEdit,
  onDelete,
  onSummarize,
}) => {
  return (
    <div className="stickyNote" style={{ backgroundColor: color }}>
      <div className="stickyNote-header">
        <h3 className="stickyNote-title">{title}</h3>
        <div className="stickyNote-icons">
          <Edit className="icon" onClick={onEdit} titleAccess="Edit" />
          <Delete className="icon" onClick={onDelete} titleAccess="Delete" />
        </div>
      </div>
      <div className="stickyNote-body">
        <p>{content}</p>
        <button className="summaryBtn" onClick={onSummarize}>
          <span className="sparkle">✨</span>
          <span className="text">AI</span>
        </button>

        {summary && (
          <div className="summaryBox">
            <h4>AI Summary</h4>
            <p>{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StickyNote;
