import { useEffect, useState } from "react";
import { api } from "../api";
import type { Movie } from "../types";

interface SuggestionResponse {
  favoriteGenre: string | null;
  suggestions: Movie[];
}

export function SuggestionsPage() {
  const [data, setData] = useState<SuggestionResponse>({
    favoriteGenre: null,
    suggestions: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/suggestions")
      .then((response) => setData(response.data))
      .catch(() => setError("Could not load suggestions yet."));
  }, []);

  return (
    <div className="page">
      <h2>Smart Suggestions</h2>
      {error && <p className="info">{error}</p>}
      <p>
        Favorite Genre:{" "}
        <strong>{data.favoriteGenre || "Not enough watched/rated movies yet"}</strong>
      </p>
      <div className="grid">
        {data.suggestions.map((movie) => (
          <article className="card" key={movie.id}>
            <h3>{movie.title}</h3>
            <p className="badge">{movie.genre}</p>
            <p>{movie.description}</p>
            <small>Release Year: {movie.releaseYear}</small>
          </article>
        ))}
      </div>
    </div>
  );
}
