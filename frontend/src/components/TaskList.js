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

  const formatDue = (dueDate) => {
    if (!dueDate) return "No due date";
    const d = new Date(dueDate);
    return d.toLocaleDateString();
  };

  const isOverdue = (task) => {
    if (!task.dueDate || task.completed) return false;
    const today = new Date();
    const due = new Date(task.dueDate);
    // clear time for comparison
    today.setHours(0,0,0,0);
    due.setHours(0,0,0,0);
    return due < today;
  };

  return (
    <ul className="task-list">
      {tasks.map((task) => {
        const overdue = isOverdue(task);
        return (
          <li
            key={task.id}
            className={`task-item ${task.completed ? "completed" : ""} ${overdue ? "overdue" : ""}`}
          >
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
                    Created: {new Date(task.createdAt).toLocaleString()}
                  </div>
                  <div className={`task-meta ${overdue ? "due-overdue" : ""}`}>
                    Due: {formatDue(task.dueDate)}
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
        );
      })}
    </ul>
  );
}
