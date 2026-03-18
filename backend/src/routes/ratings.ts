import { Router } from "express";
import { z } from "zod";
import { calculateAverageRating, calculateAverageRatingByGenre } from "../algorithms/averageRating.js";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { AppError, asyncHandler } from "../utils/http.js";

const router = Router();

const rateSchema = z.object({
  movieId: z.number().int().positive(),
  score: z.number().int().min(1).max(5),
});

router.use(requireAuth);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const data = rateSchema.parse(req.body);

    const watchlistItem = await prisma.watchlist.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId: data.movieId,
        },
      },
    });

    if (!watchlistItem || watchlistItem.status !== "WATCHED") {
      throw new AppError("Only watched movies can be rated", 400);
    }

    const rating = await prisma.rating.upsert({
      where: {
        userId_movieId: {
          userId,
          movieId: data.movieId,
        },
      },
      create: {
        userId,
        movieId: data.movieId,
        score: data.score,
      },
      update: {
        score: data.score,
      },
      include: { movie: true },
    });

    res.status(201).json(rating);
  }),
);

router.get(
  "/average",
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const ratings = (await prisma.rating.findMany({
      where: { userId },
      include: { movie: true },
    })) as Array<{ score: number; movie: { genre: string } }>;

    const overallAverage = calculateAverageRating(ratings.map((r) => r.score));
    const averageByGenre = calculateAverageRatingByGenre(
      ratings.map((r) => ({
        genre: r.movie.genre,
        score: r.score,
      })),
    );

    res.json({
      totalRatedMovies: ratings.length,
      overallAverage,
      averageByGenre,
    });
  }),
);

export default router;
