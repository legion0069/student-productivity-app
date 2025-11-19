import React from "react";

export default function TaskList({ tasks, onToggle, onDelete }) {
  if (!tasks || tasks.length === 0) {
    return <p className="muted">No tasks yet. Add your first task above.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className={`task-item ${task.completed ? "completed" : ""}`}>
          <div className="task-main">
            <label className="task-left">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggle(task.id)}
                className="task-checkbox"
              />
              <div className="task-text">
                <div className="task-title">{task.title}</div>
                {task.description ? <div className="task-desc">{task.description}</div> : null}
                <div className="task-meta">{new Date(task.createdAt).toLocaleString()}</div>
              </div>
            </label>

            <div className="task-actions">
              <button className="btn ghost" onClick={() => onDelete(task.id)} title="Delete task">
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
