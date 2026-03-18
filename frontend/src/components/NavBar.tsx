import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function NavBar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="navbar">
      <div className="navbar-title">Movie Watchlist</div>
      <nav>
        <Link className={location.pathname === "/movies" ? "active" : ""} to="/movies">
          Movies
        </Link>
        <Link className={location.pathname === "/watchlist" ? "active" : ""} to="/watchlist">
          Watchlist
        </Link>
        <Link className={location.pathname === "/suggestions" ? "active" : ""} to="/suggestions">
          Suggestions
        </Link>
      </nav>
      <button className="btn secondary" onClick={logout}>
        Logout
      </button>
    </header>
  );
}
