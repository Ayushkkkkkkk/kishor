import { WatchlistStatus } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { AppError, asyncHandler } from "../utils/http.js";

const router = Router();

const addSchema = z.object({
  movieId: z.number().int().positive(),
});

router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;

    const items = await prisma.watchlist.findMany({
      where: { userId },
      include: { movie: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(items);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const data = addSchema.parse(req.body);

    const movie = await prisma.movie.findUnique({
      where: { id: data.movieId },
    });
    if (!movie) {
      throw new AppError("Movie not found", 404);
    }

    const existing = await prisma.watchlist.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId: data.movieId,
        },
      },
    });

    if (existing) {
      throw new AppError("Movie already in watchlist", 409);
    }

    const watchlistItem = await prisma.watchlist.create({
      data: {
        userId,
        movieId: data.movieId,
        status: WatchlistStatus.TO_WATCH,
      },
      include: { movie: true },
    });

    res.status(201).json(watchlistItem);
  }),
);

router.patch(
  "/:movieId/watched",
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const movieId = Number(req.params.movieId);
    if (!Number.isFinite(movieId)) {
      throw new AppError("Invalid movie id", 400);
    }

    const watchlistItem = await prisma.watchlist.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });

    if (!watchlistItem) {
      throw new AppError("Movie not found in watchlist", 404);
    }

    const updated = await prisma.watchlist.update({
      where: { id: watchlistItem.id },
      data: { status: WatchlistStatus.WATCHED },
      include: { movie: true },
    });

    res.json(updated);
  }),
);

export default router;
