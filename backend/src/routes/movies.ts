import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/http.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const movies = await prisma.movie.findMany({
      orderBy: { title: "asc" },
    });
    res.json(movies);
  }),
);

export default router;
