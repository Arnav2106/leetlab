# LeetLab Frontend ⚡

This is the React frontend for the LeetLab application. It is responsible for giving users a modern, dynamic UI to solve challenges, write code in the browser, track time, and benchmark their problem-solving skills against test cases.

## Table of Contents
1. [Tech Stack](#tech-stack)
2. [Stores (State Management)](#stores-state-management)
3. [Key Features](#key-features)
4. [Running the Client Locally](#running-the-client-locally)
5. [Architecture overview](#architecture-overview)

---

## Tech Stack
- **Framework:** React + Vite
- **Styling:** TailwindCSS 
- **Icons:** `lucide-react`
- **State Management:** Zustand
- **Routing:** React Router v6
- **Code Editor:** `@monaco-editor/react` (Lightweight VS Code port)

## Stores (State Management)
To keep the application highly scalable and easy to test, business logic and API interaction are abstracted out of UI components and into **Zustand Stores** located in `src/store/`:
- `useAuthStore.js`: Handles JWT validation, Login, Signup.
- `useProblemStore.js`: Fetching the problems table, search filtering.
- `useExecutionStore.js`: Pushing active Moncao code to backend, handling Timer offsets, formatting `piston` execution outputs. 
- `useSubmissionStore.js`: Historical submissions table mappings.
- `usePlaylistStore.js`: Bookmark arrays.

## Key Features
- **Browser Code Sandbox:** Users write actual code with syntax highlighting (Piston mapping supports 15+ languages natively inside LeetLab, configured via `useExecutionStore.js`).
- **Timer Feature:** Active tracking of how long a user is taking to solve algorithms on top of the code editor.
- **Problem Filtering:** Custom tagging, pagination, difficulty sorts.
- **Glassmorphic UI:** Modern dark mode web aesthetic using Tailwind CSS blurs and ambient gradients (`ProblemTable.jsx` & `HomePage.jsx`).

## Running the Client Locally
1. Clone the repo and traverse into the `frontend/` directory.
2. Ensure you have Node js v18+:
   ```bash
   npm install
   ```
3. Run the vite dev server
   ```bash
   npm run dev
   ```
This maps to `localhost:5173`. Make sure the *backend* `.env` file lists this domain in `ALLOWED_ORIGINS` to prevent CORS issues.

## Architecture Overview
The application revolves fundamentally around `ProblemPage.jsx`. When users open a problem, Monaco injects a boilerplate code snippet (mapped from the backend problem creation object) based on the language dropdown. When 'Submit Solution' or 'Run Code' is pressed, it pulls the string from Monaco + the `elapsedTime` variable and ships an AXIOS post payload to `/api/v1/execute-code`. 

Happy coding!
