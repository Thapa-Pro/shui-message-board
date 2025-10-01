import React from "react";
import { Link } from "react-router-dom";

export default function MessageCard({ msg, onEdit, onDelete }) {
  const date = new Date(msg.createdAt || 0).toLocaleString();
  return (
    <div className="card">
      <p className="text">{msg.text}</p>
      <div className="meta">
        <Link className="user" to={`/user/${encodeURIComponent(msg.username)}`}>
          @{msg.username}
        </Link>
        <span className="dot">•</span>
        <span className="date">{date}</span>
      </div>
      {(onEdit || onDelete) && (
        <div className="actions">
          {onEdit && (
            <button className="btn btn-warn" onClick={() => onEdit(msg)}>
              Edit
            </button>
          )}
          {onDelete && (
            <button className="btn btn-danger" onClick={() => onDelete(msg)}>
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
