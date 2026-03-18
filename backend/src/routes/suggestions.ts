import { Router } from "express";
import {
  findMostLikedGenre,
  suggestMoviesByGenre,
} from "../algorithms/genreSuggestion.js";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/http.js";

const router = Router();
router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;

    const [watchlist, ratings, movies] = (await Promise.all([
      prisma.watchlist.findMany({
        where: { userId },
        include: { movie: true },
      }),
      prisma.rating.findMany({
        where: { userId },
        include: { movie: true },
      }),
      prisma.movie.findMany({
        orderBy: { title: "asc" },
      }),
    ])) as [
      Array<{ movieId: number; status: "TO_WATCH" | "WATCHED"; movie: { genre: string } }>,
      Array<{ score: number; movie: { genre: string } }>,
      Array<{
        id: number;
        title: string;
        genre: string;
        description: string;
        releaseYear: number;
      }>,
    ];

    const watchedMovieIds = watchlist
      .filter((item) => item.status === "WATCHED")
      .map((item) => item.movieId);

    const highRatedSignals = ratings
      .filter((rating) => rating.score >= 4)
      .map((rating) => ({
        genre: rating.movie.genre,
        score: rating.score,
        watched: true,
      }));

    const watchedSignals = watchlist
      .filter((item) => item.status === "WATCHED")
      .map((item) => ({
        genre: item.movie.genre,
        score: null,
        watched: true,
      }));

    const favoriteGenre = findMostLikedGenre([
      ...highRatedSignals,
      ...watchedSignals,
    ]);

    const suggestions = favoriteGenre
      ? suggestMoviesByGenre({
          movies,
          watchedMovieIds,
          favoriteGenre,
          limit: 8,
        })
      : [];

    res.json({
      favoriteGenre,
      suggestions,
    });
  }),
);

export default router;
