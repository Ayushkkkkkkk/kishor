import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/http.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const genre = typeof req.query.genre === "string" ? req.query.genre.trim() : "";
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";

    const movies = await prisma.movie.findMany({
      where: {
        ...(genre ? { genre } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search } },
                { description: { contains: search } },
              ],
            }
          : {}),
      },
      orderBy: { title: "asc" },
    });
    res.json(movies);
  }),
);

export default router;
