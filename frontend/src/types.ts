export interface User {
  id: number;
  name: string;
  email: string;
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
