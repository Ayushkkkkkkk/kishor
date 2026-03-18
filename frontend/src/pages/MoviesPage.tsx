import { useEffect, useState } from "react";
import { api } from "../api";
import type { Movie } from "../types";

export function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/movies").then((response) => setMovies(response.data));
  }, []);

  async function addToWatchlist(movieId: number) {
    setMessage("");
    try {
      await api.post("/watchlist", { movieId });
      setMessage("Movie added to watchlist.");
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Could not add movie.");
    }
  }

  return (
    <div className="page">
      <h2>Browse Movies</h2>
      {message && <p className="info">{message}</p>}
      <div className="grid">
        {movies.map((movie) => (
          <article className="card" key={movie.id}>
            <h3>{movie.title}</h3>
            <p className="badge">{movie.genre}</p>
            <p>{movie.description}</p>
            <small>Release Year: {movie.releaseYear}</small>
            <button className="btn" onClick={() => addToWatchlist(movie.id)}>
              Add to Watchlist
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
