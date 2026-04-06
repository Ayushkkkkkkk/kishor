import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { AppError, asyncHandler } from "../utils/http.js";

const router = Router();

const movieSchema = z.object({
  title: z.string().min(1),
  genre: z.string().min(1),
  description: z.string().min(5),
  releaseYear: z.number().int().min(1900).max(2100),
});

router.use(requireAuth, requireAdmin);

router.get(
  "/stats",
  asyncHandler(async (_req, res) => {
    const [users, movies, watchlist, ratings] = await Promise.all([
      prisma.user.count(),
      prisma.movie.count(),
      prisma.watchlist.count(),
      prisma.rating.count(),
    ]);

    res.json({
      users,
      movies,
      watchlistItems: watchlist,
      ratings,
    });
  }),
);

router.get(
  "/movies",
  asyncHandler(async (_req, res) => {
    const movies = await prisma.movie.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(movies);
  }),
);

router.post(
  "/movies",
  asyncHandler(async (req, res) => {
    const data = movieSchema.parse(req.body);
    const movie = await prisma.movie.create({ data });
    res.status(201).json(movie);
  }),
);

router.put(
  "/movies/:id",
  asyncHandler(async (req, res) => {
    const movieId = Number(req.params.id);
    if (!Number.isFinite(movieId)) {
      throw new AppError("Invalid movie id", 400);
    }
    const data = movieSchema.parse(req.body);

    const existing = await prisma.movie.findUnique({ where: { id: movieId } });
    if (!existing) {
      throw new AppError("Movie not found", 404);
    }

    const updated = await prisma.movie.update({
      where: { id: movieId },
      data,
    });

    res.json(updated);
  }),
);

router.delete(
  "/movies/:id",
  asyncHandler(async (req, res) => {
    const movieId = Number(req.params.id);
    if (!Number.isFinite(movieId)) {
      throw new AppError("Invalid movie id", 400);
    }

    const existing = await prisma.movie.findUnique({ where: { id: movieId } });
    if (!existing) {
      throw new AppError("Movie not found", 404);
    }

    await prisma.movie.delete({ where: { id: movieId } });
    res.json({ message: "Movie deleted" });
  }),
);

export default router;
