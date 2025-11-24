import React from "react";

export default function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-title-block">
        <h1>Student Productivity App</h1>
        <p className="subtitle">
          Plan your day, track your tasks, and stay consistent.
        </p>
      </div>
      <div className="app-badge">
        <span className="badge-label">Project 1</span>
        <span className="badge-pill">100 Days of Code</span>
      </div>
    </header>
  );
}
