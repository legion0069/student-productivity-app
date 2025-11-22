import React from "react";

export default function TaskStats({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="stats-card">
      <h3 className="stats-title">Task Statistics</h3>
      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-number">{total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">{completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">{pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">{percent}%</div>
          <div className="stat-label">Completion</div>
        </div>
      </div>
    </div>
  );
}
