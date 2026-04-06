import "dotenv/config";
import cors from "cors";
import express from "express";
import { ZodError } from "zod";
import type { NextFunction, Request, Response } from "express";
import authRoutes from "./routes/auth.js";
import movieRoutes from "./routes/movies.js";
import watchlistRoutes from "./routes/watchlist.js";
import ratingRoutes from "./routes/ratings.js";
import suggestionRoutes from "./routes/suggestions.js";
import adminRoutes from "./routes/admin.js";
import { AppError } from "./utils/http.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ message: "Backend running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/admin", adminRoutes);

app.use((error: unknown, _req: Request, _res: Response, next: NextFunction) => {
  if (error instanceof ZodError) {
    return next(new AppError(error.issues[0]?.message || "Invalid request data", 400));
  }
  return next(error as Error);
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server] running on http://localhost:${port}`);
});
