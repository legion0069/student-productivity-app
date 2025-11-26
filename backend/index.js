require("dotenv").config();
const express = require("express");
const cors = require("cors");

const {
  initStore,
  getAllTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
  resetStore
} = require("./taskStore");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize in-memory store from file
initStore();

// Detailed health/status endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT) || 5000,
    timestamp: new Date().toISOString()
  });
});

// Task statistics endpoint
app.get("/stats", (req, res) => {
  const tasks = getAllTasks();
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const completion = total === 0 ? 0 : Math.round((completed / total) * 100);

  res.json({
    total,
    completed,
    pending,
    completionPercentage: completion
  });
});

res.status(500).json({ error: "Failed to create task" });


// GET /tasks
app.get("/tasks", (req, res) => {
  const tasks = getAllTasks();
  res.json(tasks);
});

// POST /tasks
app.post("/tasks", async (req, res) => {
  const { title, description, dueDate, priority } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }
  try {
    const task = await createTask({ title, description, dueDate, priority });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// PUT /tasks/:id - edit
app.put("/tasks/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, description, priority } = req.body;
  try {
    const task = await updateTask(id, { title, description, priority });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (err) {
    if (err.message === "Title cannot be empty") {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// PUT /tasks/:id/toggle
app.put("/tasks/:id/toggle", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const task = await toggleTask(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to toggle task" });
  }
});

// DELETE /tasks/:id
app.delete("/tasks/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const deleted = await deleteTask(id);
    if (!deleted) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ ok: true, deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// Dev reset
app.post("/_reset", async (req, res) => {
  try {
    await resetStore();
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reset" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
