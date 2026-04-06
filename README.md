# Movie Watchlist and Smart Suggestion System

Simple full-stack web app using:

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + Prisma + SQLite
- Auth: JWT

## Features

- Register and login
- Browse movies
- Search movies by title/description
- Filter movies by genre
- Add movies to watchlist
- Mark movies as watched
- Rate watched movies (1 to 5)
- Smart suggestions based on favorite genre
- Admin panel with:
  - App stats (users, movies, watchlist items, ratings)
  - Add/edit/delete movies
- Netflix-style dark black/red theme UI

## Required Algorithms (separate files)

1. Average rating calculation:
   - `backend/src/algorithms/averageRating.ts`
   - Calculates overall average and genre-wise average from rated watched movies.

2. Genre-based suggestion:
   - `backend/src/algorithms/genreSuggestion.ts`
   - Finds favorite genre from watched/high-rated movies and suggests unwatched movies from that genre.

## Backend Structure

- `backend/prisma/schema.prisma` models:
  - `User`
  - `Movie`
  - `Watchlist`
  - `Rating`
- Routes:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/movies?search=...&genre=...`
  - `GET /api/watchlist`
  - `POST /api/watchlist`
  - `PATCH /api/watchlist/:movieId/watched`
  - `POST /api/ratings`
  - `GET /api/ratings/average`
  - `GET /api/suggestions`
  - Admin-only:
    - `GET /api/admin/stats`
    - `GET /api/admin/movies`
    - `POST /api/admin/movies`
    - `PUT /api/admin/movies/:id`
    - `DELETE /api/admin/movies/:id`

## Frontend Pages

- Login/Register page
- Movies page
- Watchlist page
- Suggestions page
- Admin panel page (for ADMIN users)

## Run Locally

No MySQL/Postgres install is needed. Prisma uses SQLite and creates a local file DB automatically.

### 1) Backend

```bash
cd backend
npm install
cp env.example .env
npx prisma migrate dev --name init
npx prisma generate
npm run prisma:seed
npm run dev
```

Backend runs on `http://localhost:5000`.

Default seeded admin credentials:

- Email: `admin@movieapp.com`
- Password: `admin123`

You can override these in `backend/.env` using:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

### Fast Presentation Setup (friend's machine)

If your friend just needs a quick demo tomorrow, use this one-time setup command:

```bash
cd backend
npm install
npm run demo
```

This will:

- create `.env` if missing
- generate Prisma client
- create/update local SQLite DB file
- seed movies + admin account
- start backend server

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

If needed, set frontend API URL:

```bash
VITE_API_URL=http://localhost:5000/api
```
