const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "data", "tasks.json");

let tasks = [];
let nextId = 1;

// Load tasks from file at startup
function initStore() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      tasks = parsed.map(t => ({
        ...t,
        priority: t.priority || "normal"
      }));
      const maxId = tasks.reduce((m, t) => (t.id && t.id > m ? t.id : m), 0);
      nextId = maxId + 1;
    } else {
      tasks = [];
      nextId = 1;
    }
  } catch (err) {
    tasks = [];
    nextId = 1;
    try {
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), "utf8");
    } catch (e) {
      console.error("Failed to create data file:", e);
    }
  }
}

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

// CRUD-like helpers

function getAllTasks() {
  return tasks;
}

async function createTask({ title, description, dueDate, priority }) {
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
  return task;
}

async function updateTask(id, { title, description, priority }) {
  const task = tasks.find(t => t.id === id);
  if (!task) return null;

  if (title !== undefined) {
    if (!title.trim()) {
      throw new Error("Title cannot be empty");
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
  return task;
}

async function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return null;
  task.completed = !task.completed;
  await saveTasks();
  return task;
}

async function deleteTask(id) {
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return null;
  const [deleted] = tasks.splice(idx, 1);
  await saveTasks();
  return deleted;
}

async function resetStore() {
  tasks = [];
  nextId = 1;
  await saveTasks();
}

module.exports = {
  initStore,
  getAllTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
  resetStore
};
