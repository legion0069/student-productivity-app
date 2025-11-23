import React, { useState, useRef, useEffect } from "react";

export default function TaskInput({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const titleRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) titleRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    await onAdd({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || null
    });
    setTitle("");
    setDescription("");
    setDueDate("");
    if (titleRef.current) titleRef.current.focus();
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        ref={titleRef}
        className="input title-input"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="input desc-input"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        className="input date-input"
        type="date"
        value={dueDate || ""}
        onChange={(e) => setDueDate(e.target.value)}
        title="Due date (optional)"
      />
      <button className="btn primary" type="submit" disabled={!title.trim()}>
        Add
      </button>
    </form>
  );
}
