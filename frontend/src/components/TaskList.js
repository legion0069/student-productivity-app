import React from "react";

export default function TaskList({ tasks, onToggle, onDelete, onEdit }) {
  if (!tasks || tasks.length === 0) {
    return <p className="muted">No tasks yet. Add your first task above.</p>;
  }

  const priorityBadge = (priority) => {
    if (priority === "high") return <span className="pill pill-high">High</span>;
    if (priority === "low") return <span className="pill pill-low">Low</span>;
    return <span className="pill pill-normal">Normal</span>;
  };

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
                <div className="task-title-row">
                  <span className="task-title">{task.title}</span>
                  {priorityBadge(task.priority)}
                </div>
                {task.description ? <div className="task-desc">{task.description}</div> : null}
                <div className="task-meta">
                  {new Date(task.createdAt).toLocaleString()}
                </div>
              </div>
            </label>

            <div className="task-actions">
              <button
                className="btn ghost"
                onClick={() => onEdit(task)}
                title="Edit task"
              >
                Edit
              </button>
              <button
                className="btn ghost danger"
                onClick={() => onDelete(task.id)}
                title="Delete task"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
