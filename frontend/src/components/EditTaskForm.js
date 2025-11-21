import React, { useEffect, useState } from "react";

export default function EditTaskForm({ task, onSave, onCancel }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState(task?.priority || "normal");

  useEffect(() => {
    setTitle(task?.title || "");
    setDescription(task?.description || "");
    setPriority(task?.priority || "normal");
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    onSave({
      ...task,
      title: title.trim(),
      description: description.trim(),
      priority
    });
  };

  if (!task) return null;

  return (
    <form className="task-form edit-form" onSubmit={handleSubmit}>
      <span className="edit-label">Editing:</span>
      <input
        className="input title-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
      />
      <input
        className="input desc-input"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <select
        className="input priority-select"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="low">Low</option>
        <option value="normal">Normal</option>
        <option value="high">High</option>
      </select>
      <button className="btn primary" type="submit">
        Save
      </button>
      <button
        className="btn ghost"
        type="button"
        onClick={onCancel}
      >
        Cancel
      </button>
    </form>
  );
}
