# Secure Notes Frontend

React (Vite) frontend for the note-taking app — login/register, notes CRUD, and role-based admin pages. Talks to the backend API over `fetch`.

## Requirements

- Node.js >= 20.19
- The backend API running (see `../Backend`)

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` and set `VITE_API_URL` to the backend's URL.

## Run

```bash
npm run dev       # development server
npm run build     # production build
npm run preview   # preview the production build
npm run lint       # eslint
```

Dev server runs on `http://localhost:5173` by default.

## Demo Admin Account

```
email: admin@admin.com
password: password
```
