const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory tasks store
let tasks = [];
let nextId = 1;

// Root health check
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// GET /tasks - return all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// POST /tasks - create a new task
app.post("/tasks", (req, res) => {
  const { title, description, dueDate } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }
  const task = {
    id: nextId++,
    title: title.trim(),
    description: description ? description.trim() : "",
    dueDate: dueDate || null,
    completed: false,
    createdAt: new Date().toISOString()
  };
  tasks.unshift(task); // newest first
  res.status(201).json(task);
});

// PUT /tasks/:id/toggle - toggle completed
app.put("/tasks/:id/toggle", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  task.completed = !task.completed;
  res.json(task);
});

// Dev helper to reset tasks (optional)
app.post("/_reset", (req, res) => {
  tasks = [];
  nextId = 1;
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
