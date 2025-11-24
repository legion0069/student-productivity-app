import React, { useEffect, useState } from "react";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import EditTaskForm from "./components/EditTaskForm";
import TaskStats from "./components/TaskStats";
import AppHeader from "./components/AppHeader";


const API = process.env.REACT_APP_API_BASE || "http://localhost:5000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("all"); // all | active | completed
  const [sort, setSort] = useState("created-desc"); // created-desc | created-asc | due-asc | due-desc | priority

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

  const filteredTasks = tasks
  .filter(t => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  })
  .slice() // copy array before sorting
  .sort((a, b) => {
    if (sort === "created-desc") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sort === "created-asc") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (sort === "due-asc") {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sort === "due-desc") {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(b.dueDate) - new Date(a.dueDate);
    }
    if (sort === "priority") {
      const order = { high: 0, normal: 1, low: 2 };
      const pa = order[a.priority || "normal"];
      const pb = order[b.priority || "normal"];
      return pa - pb;
    }
    return 0;
  });

return (
  <div className="app-shell">
    <AppHeader />

    <main className="app-main">
      {/* Top toolbar: filters + sort */}
      <section className="app-section toolbar-section">
        <div className="toolbar-row">
          <div className="filters-group">
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

          <div className="sort-group">
            <span className="sort-label">Sort by:</span>
            <select
              className="input sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="created-desc">Created: Newest first</option>
              <option value="created-asc">Created: Oldest first</option>
              <option value="due-asc">Due date: Soonest first</option>
              <option value="due-desc">Due date: Latest first</option>
              <option value="priority">Priority: High → Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* Form + stats */}
      <section className="app-section">
        <TaskInput onAdd={addTask} />
        <TaskStats tasks={filteredTasks} />
      </section>

      {/* Edit form */}
      {editingTask && (
        <section className="app-section">
          <EditTaskForm
            task={editingTask}
            onSave={saveEdit}
            onCancel={cancelEdit}
          />
        </section>
      )}

      {/* Task list */}
      <section className="app-section">
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
      </section>
    </main>

    <footer className="app-footer">
      <span>Built as part of a 100 Days of Code journey.</span>
    </footer>
  </div>
);

  
  
}

export default App;
