import React from "react";

export default function TaskList({ tasks, onToggle }) {
  if (!tasks || tasks.length === 0) {
    return <p>No tasks yet.</p>;
  }

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <label>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task.id)}
            />
            <strong>{task.title}</strong> – {task.description}
          </label>
        </li>
      ))}
    </ul>
  );
}
