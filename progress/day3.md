# Day 3 Progress  
Date: 2025-11-18

## ✔ Backend
- Added in-memory task storage using an array.
- Implemented **GET /tasks** to fetch all tasks.
- Implemented **POST /tasks** to create new tasks with title and description.
- Added **PUT /tasks/:id/toggle** to toggle task completion.
- Tested all API routes using frontend and confirmed correct responses.

## ✔ Frontend
- Created **TaskInput** component to add new tasks.
- Created **TaskList** component to display tasks with checkbox toggle.
- Updated **App.js** to:
  - Fetch tasks from backend on page load.
  - Add tasks to backend using POST API.
  - Toggle tasks using PUT API.
- Successfully connected frontend and backend.
- Tested full add → list → toggle flow in browser.

## ✔ What I achieved today
- Fully functional task creation and toggling.
- Frontend and backend communication working correctly.
- Built basic real-world full-stack functionality.

## ➡️ Next Steps (Day 4)
- Implement persistent storage using a JSON file or lowdb.
- Add DELETE functionality (remove tasks).
- Improve UI small details and validation.
- Add progress notes and push to GitHub.
