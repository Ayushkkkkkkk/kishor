import { useEffect, useState } from "react";
import { api } from "../api";
import type { Movie } from "../types";

export function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [message, setMessage] = useState("");

  async function loadMovies() {
    const response = await api.get("/movies", {
      params: {
        ...(search ? { search } : {}),
        ...(genre ? { genre } : {}),
      },
    });
    setMovies(response.data);
  }

  useEffect(() => {
    loadMovies();
  }, [search, genre]);

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
      <section className="filters">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by title or description"
        />
        <select value={genre} onChange={(event) => setGenre(event.target.value)}>
          <option value="">All genres</option>
          <option value="Action">Action</option>
          <option value="Comedy">Comedy</option>
          <option value="Drama">Drama</option>
          <option value="Horror">Horror</option>
          <option value="Romance">Romance</option>
          <option value="Sci-Fi">Sci-Fi</option>
        </select>
      </section>
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
