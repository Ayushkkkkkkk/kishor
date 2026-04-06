export interface User {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface Movie {
  id: number;
  title: string;
  genre: string;
  description: string;
  releaseYear: number;
}

export interface WatchlistItem {
  id: number;
  userId: number;
  movieId: number;
  status: "TO_WATCH" | "WATCHED";
  movie: Movie;
}

export interface RatingAverageResponse {
  totalRatedMovies: number;
  overallAverage: number;
  averageByGenre: Record<string, number>;
}

export interface AdminStats {
  users: number;
  movies: number;
  watchlistItems: number;
  ratings: number;
}
