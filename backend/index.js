const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, "data", "tasks.json");

app.use(cors());
app.use(express.json());

// Helper: load tasks from file (sync at startup)
let tasks = [];
let nextId = 1;
try {
  const raw = fs.readFileSync(DATA_FILE, "utf8");
  const parsed = JSON.parse(raw);
  if (Array.isArray(parsed)) {
    tasks = parsed;
    // ensure priority field exists
    tasks = tasks.map(t => ({
      ...t,
      priority: t.priority || "normal"
    }));
    // set nextId to max id + 1
    const maxId = tasks.reduce((m, t) => (t.id && t.id > m ? t.id : m), 0);
    nextId = maxId + 1;
  } else {
    tasks = [];
  }
} catch (err) {
  tasks = [];
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), "utf8");
  } catch (e) {
    console.error("Failed to create data file:", e);
  }
}

// Helper: persist tasks to file (async)
async function saveTasks() {
  try {
    await fs.promises.writeFile(
      DATA_FILE,
      JSON.stringify(tasks, null, 2),
      "utf8"
    );
  } catch (err) {
    console.error("Failed to save tasks:", err);
  }
}

// Root health check
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// GET /tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// POST /tasks
app.post("/tasks", async (req, res) => {
  const { title, description, dueDate, priority } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }
  const task = {
    id: nextId++,
    title: title.trim(),
    description: description ? description.trim() : "",
    dueDate: dueDate || null,
    completed: false,
    priority: priority || "normal",
    createdAt: new Date().toISOString()
  };
  tasks.unshift(task);
  await saveTasks();
  res.status(201).json(task);
});

// PUT /tasks/:id - edit task (title / description / priority)
app.put("/tasks/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, description, priority } = req.body;
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  if (title !== undefined) {
    if (!title.trim()) {
      return res.status(400).json({ error: "Title cannot be empty" });
    }
    task.title = title.trim();
  }
  if (description !== undefined) {
    task.description = description ? description.trim() : "";
  }
  if (priority !== undefined) {
    task.priority = priority || "normal";
  }

  await saveTasks();
  res.json(task);
});

// PUT /tasks/:id/toggle
app.put("/tasks/:id/toggle", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  task.completed = !task.completed;
  await saveTasks();
  res.json(task);
});

// DELETE /tasks/:id
app.delete("/tasks/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: "Task not found" });
  const [deleted] = tasks.splice(idx, 1);
  await saveTasks();
  res.json({ ok: true, deleted });
});

app.post("/_reset", async (req, res) => {
  tasks = [];
  nextId = 1;
  await saveTasks();
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
