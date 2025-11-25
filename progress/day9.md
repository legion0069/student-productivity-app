# Day 9 Progress  
Date: 2025-11-23

## Completed
- Installed and configured dotenv for environment variables.
- Added `.env.example` and updated `.gitignore` to ignore local `.env`.
- Extracted all task persistence logic into a separate `taskStore.js` module.
- Updated `index.js` to use clean helper functions instead of raw fs calls.
- Kept existing JSON file storage but structured code to be ready for MongoDB.

## Why this is important
- Backend is now cleaner and easier to maintain.
- Future database migration (MongoDB or others) will be much simpler.
- Professional structure (config + store module) looks good to recruiters.

## Next (Day 10)
- Start actual migration plan towards MongoDB (or another database).
- Add a configuration flag to switch between file storage and DB (future).
- Tidy up error messages and status codes for API responses.
