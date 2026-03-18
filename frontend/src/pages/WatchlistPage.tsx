import { useEffect, useState } from "react";
import { api } from "../api";
import type { RatingAverageResponse, WatchlistItem } from "../types";

export function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [averages, setAverages] = useState<RatingAverageResponse | null>(null);
  const [message, setMessage] = useState("");

  async function loadData() {
    const [watchlistRes, averagesRes] = await Promise.all([
      api.get("/watchlist"),
      api.get("/ratings/average"),
    ]);
    setItems(watchlistRes.data);
    setAverages(averagesRes.data);
  }

  useEffect(() => {
    loadData().catch(() => {
      setMessage("Could not load watchlist.");
    });
  }, []);

  async function markAsWatched(movieId: number) {
    try {
      await api.patch(`/watchlist/${movieId}/watched`);
      await loadData();
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Failed to update watch status");
    }
  }

  async function rateMovie(movieId: number, score: number) {
    try {
      await api.post("/ratings", { movieId, score });
      await loadData();
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Could not save rating");
    }
  }

  return (
    <div className="page">
      <h2>Your Watchlist</h2>
      {message && <p className="info">{message}</p>}

      {averages && (
        <section className="card">
          <h3>Average Ratings</h3>
          <p>
            Overall Average: <strong>{averages.overallAverage}</strong> ({averages.totalRatedMovies} rated)
          </p>
          <div className="genre-list">
            {Object.entries(averages.averageByGenre).map(([genre, value]) => (
              <span className="badge" key={genre}>
                {genre}: {value}
              </span>
            ))}
          </div>
        </section>
      )}

      <div className="grid">
        {items.map((item) => (
          <article className="card" key={item.id}>
            <h3>{item.movie.title}</h3>
            <p className="badge">{item.movie.genre}</p>
            <p>Status: {item.status}</p>
            {item.status === "TO_WATCH" ? (
              <button className="btn" onClick={() => markAsWatched(item.movieId)}>
                Mark as Watched
              </button>
            ) : (
              <div className="rating-row">
                <span>Rate:</span>
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    className="btn secondary rating-btn"
                    onClick={() => rateMovie(item.movieId, score)}
                  >
                    {score}
                  </button>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
