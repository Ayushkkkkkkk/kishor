import { FormEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user, setAuth } = useAuth();

  if (user) {
    return <Navigate to="/movies" replace />;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const payload = isRegister ? { name, email, password } : { email, password };
      const response = await api.post(endpoint, payload);
      setAuth(response.data.user, response.data.token);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div className="center-page">
      <form className="card auth-card" onSubmit={onSubmit}>
        <h2>{isRegister ? "Register" : "Login"}</h2>

        {isRegister && (
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            type="text"
            placeholder="Name"
            required
          />
        )}
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="Email"
          required
        />
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          placeholder="Password"
          minLength={6}
          required
        />

        {error && <p className="error">{error}</p>}

        <button className="btn" type="submit">
          {isRegister ? "Create Account" : "Sign In"}
        </button>
        <button
          className="btn secondary"
          type="button"
          onClick={() => setIsRegister((prev) => !prev)}
        >
          {isRegister ? "Already have an account? Login" : "New user? Register"}
        </button>
      </form>
    </div>
  );
}
