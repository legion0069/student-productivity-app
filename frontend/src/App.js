import React, { useEffect, useState } from "react";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import EditTaskForm from "./components/EditTaskForm";

const API = process.env.REACT_APP_API_BASE || "http://localhost:5000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("all"); // all | active | completed

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

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      const res = await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to delete");
        return;
      }
      setTasks(prev => prev.filter(t => t.id !== id));
      if (editingTask && editingTask.id === id) {
        setEditingTask(null);
      }
    } catch (err) {
      console.error(err);
      alert("Network error while deleting task");
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
  };

  const saveEdit = async (updatedTask) => {
    try {
      const res = await fetch(`${API}/tasks/${updatedTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: updatedTask.title,
          description: updatedTask.description,
          priority: updatedTask.priority
        })
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to update task");
        return;
      }
      const saved = await res.json();
      setTasks(prev => prev.map(t => (t.id === saved.id ? saved : t)));
      setEditingTask(null);
    } catch (err) {
      console.error(err);
      alert("Network error while updating task");
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return (
    <div style={{ maxWidth: 900, margin: "32px auto", padding: 16 }} className="app">
      <h1>Student Productivity App</h1>

      {/* Filters */}
      <div style={{ marginBottom: 12 }}>
        <button
          className={`btn filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`btn filter-btn ${filter === "active" ? "active" : ""}`}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={`btn filter-btn ${filter === "completed" ? "active" : ""}`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      <TaskInput onAdd={addTask} />

      {editingTask && (
        <EditTaskForm
          task={editingTask}
          onSave={saveEdit}
          onCancel={cancelEdit}
        />
      )}

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <TaskList
          tasks={filteredTasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={handleEditClick}
        />
      )}
    </div>
  );
}

export default App;
