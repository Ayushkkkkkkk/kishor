# Movie Watchlist and Smart Suggestion System

Simple full-stack web app using:

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + Prisma + SQLite
- Auth: JWT

## Features

- Register and login
- Browse movies
- Add movies to watchlist
- Mark movies as watched
- Rate watched movies (1 to 5)
- Smart suggestions based on favorite genre

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
  - `GET /api/movies`
  - `GET /api/watchlist`
  - `POST /api/watchlist`
  - `PATCH /api/watchlist/:movieId/watched`
  - `POST /api/ratings`
  - `GET /api/ratings/average`
  - `GET /api/suggestions`

## Frontend Pages

- Login/Register page
- Movies page
- Watchlist page
- Suggestions page

## Run Locally

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
