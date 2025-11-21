# Day 5 Progress  
Date: 2025-11-19

## Backend
- Added PUT /tasks/:id endpoint to edit existing tasks.
- Extended task structure with a priority field (low, normal, high).
- Ensured all changes are persisted to data/tasks.json.

## Frontend
- Added EditTaskForm component to update task title, description, and priority.
- Updated TaskList to show priority badges and provide Edit/Delete buttons.
- Implemented filters (All / Active / Completed) in App state.
- Verified full flow: add → edit → toggle → delete → filter.

## What I achieved today
- Implemented a realistic edit workflow for tasks.
- Added task filtering and priority to make the app more useful.
- Created multiple meaningful commits for GitHub contributions.

## Next (Day 6)
- Add simple stats (total tasks, completed, pending).
- Add due date support in UI.
- Improve layout and maybe start basic auth or user profiles.
