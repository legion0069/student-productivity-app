import React, { useEffect, useState } from "react";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";

const API = process.env.REACT_APP_API_BASE || "http://localhost:5000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch tasks
  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/tasks`);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
      alert("Could not load tasks. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTasks(); }, []);

  // add task
  const addTask = async (taskData) => {
    try {
      const res = await fetch(`${API}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to add task");
        return;
      }
      const newTask = await res.json();
      setTasks(prev => [newTask, ...prev]);
    } catch (err) {
      console.error(err);
      alert("Network error while adding task");
    }
  };

  // toggle
  const toggleTask = async (id) => {
    try {
      const res = await fetch(`${API}/tasks/${id}/toggle`, { method: "PUT" });
      if (!res.ok) return;
      const updated = await res.json();
      setTasks(prev => prev.map(t => (t.id === updated.id ? updated : t)));
    } catch (err) {
      console.error(err);
      alert("Failed to toggle task");
    }
  };

  // delete
  const deleteTask = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      const res = await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to delete");
        return;
      }
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("Network error while deleting task");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "32px auto", padding: 16 }}>
      <h1>Student Productivity App</h1>
      <TaskInput onAdd={addTask} />
      {loading ? <p>Loading tasks...</p> : <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />}
    </div>
  );
}

export default App;
