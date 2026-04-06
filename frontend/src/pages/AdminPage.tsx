import { FormEvent, useEffect, useState } from "react";
import { api } from "../api";
import type { AdminStats, Movie } from "../types";

const initialForm = {
  title: "",
  genre: "",
  description: "",
  releaseYear: new Date().getFullYear(),
};

export function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  async function loadData() {
    const [statsRes, moviesRes] = await Promise.all([
      api.get("/admin/stats"),
      api.get("/admin/movies"),
    ]);
    setStats(statsRes.data);
    setMovies(moviesRes.data);
  }

  useEffect(() => {
    loadData().catch(() => setMessage("Unable to load admin data"));
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("");

    try {
      const payload = {
        ...form,
        releaseYear: Number(form.releaseYear),
      };

      if (editingId) {
        await api.put(`/admin/movies/${editingId}`, payload);
        setMessage("Movie updated");
      } else {
        await api.post("/admin/movies", payload);
        setMessage("Movie created");
      }

      setForm(initialForm);
      setEditingId(null);
      await loadData();
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Save failed");
    }
  }

  function onEdit(movie: Movie) {
    setEditingId(movie.id);
    setForm({
      title: movie.title,
      genre: movie.genre,
      description: movie.description,
      releaseYear: movie.releaseYear,
    });
  }

  async function onDelete(movieId: number) {
    setMessage("");
    try {
      await api.delete(`/admin/movies/${movieId}`);
      setMessage("Movie deleted");
      if (editingId === movieId) {
        setEditingId(null);
        setForm(initialForm);
      }
      await loadData();
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Delete failed");
    }
  }

  return (
    <div className="page">
      <h2>Admin Panel</h2>
      {message && <p className="info">{message}</p>}

      {stats && (
        <section className="stats-grid">
          <article className="card">
            <h4>Total Users</h4>
            <p className="stat-value">{stats.users}</p>
          </article>
          <article className="card">
            <h4>Total Movies</h4>
            <p className="stat-value">{stats.movies}</p>
          </article>
          <article className="card">
            <h4>Watchlist Items</h4>
            <p className="stat-value">{stats.watchlistItems}</p>
          </article>
          <article className="card">
            <h4>Ratings</h4>
            <p className="stat-value">{stats.ratings}</p>
          </article>
        </section>
      )}

      <section className="card">
        <h3>{editingId ? "Edit Movie" : "Add New Movie"}</h3>
        <form className="admin-form" onSubmit={onSubmit}>
          <input
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            placeholder="Title"
            required
          />
          <input
            value={form.genre}
            onChange={(event) => setForm({ ...form, genre: event.target.value })}
            placeholder="Genre"
            required
          />
          <textarea
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            placeholder="Description"
            required
          />
          <input
            value={form.releaseYear}
            onChange={(event) => setForm({ ...form, releaseYear: Number(event.target.value) })}
            type="number"
            min={1900}
            max={2100}
            required
          />
          <div className="admin-form-actions">
            <button className="btn" type="submit">
              {editingId ? "Update Movie" : "Create Movie"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm(initialForm);
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="grid">
        {movies.map((movie) => (
          <article className="card" key={movie.id}>
            <h3>{movie.title}</h3>
            <p className="badge">{movie.genre}</p>
            <p>{movie.description}</p>
            <small>Release Year: {movie.releaseYear}</small>
            <div className="rating-row">
              <button className="btn" onClick={() => onEdit(movie)}>
                Edit
              </button>
              <button className="btn secondary danger" onClick={() => onDelete(movie.id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
