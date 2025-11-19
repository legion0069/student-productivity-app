import React, { useEffect, useState } from "react";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";

const API = "http://localhost:5000";

function App() {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks when app opens
  const loadTasks = async () => {
    const res = await fetch(`${API}/tasks`);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Add task
  const addTask = async (taskData) => {
    const res = await fetch(`${API}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
    const newTask = await res.json();
    setTasks((prev) => [newTask, ...prev]);
  };

  // Toggle task
  const toggleTask = async (id) => {
    const res = await fetch(`${API}/tasks/${id}/toggle`, {
      method: "PUT",
    });
    const updated = await res.json();
    setTasks((prev) =>
      prev.map((task) => (task.id === updated.id ? updated : task))
    );
  };

  return (
    <div>
      <h1>Student Productivity App</h1>
      <TaskInput onAdd={addTask} />
      <TaskList tasks={tasks} onToggle={toggleTask} />
    </div>
  );
}

export default App;
