export interface UserGenreSignal {
  genre: string;
  score?: number | null;
  watched: boolean;
}

export interface MovieCandidate {
  id: number;
  title: string;
  genre: string;
  description: string;
  releaseYear: number;
}

export function findMostLikedGenre(signals: UserGenreSignal[]): string | null {
  if (!signals.length) return null;

  const weights: Record<string, number> = {};

  for (const signal of signals) {
    const base = signal.score && signal.score > 0 ? signal.score : 2;
    const watchedBonus = signal.watched ? 0.5 : 0;
    const weight = base + watchedBonus;

    weights[signal.genre] = (weights[signal.genre] || 0) + weight;
  }

  let bestGenre: string | null = null;
  let bestScore = -1;

  for (const [genre, score] of Object.entries(weights)) {
    if (score > bestScore) {
      bestScore = score;
      bestGenre = genre;
    }
  }

  return bestGenre;
}

export function suggestMoviesByGenre(params: {
  movies: MovieCandidate[];
  watchedMovieIds: number[];
  favoriteGenre: string;
  limit?: number;
}): MovieCandidate[] {
  const watchedSet = new Set(params.watchedMovieIds);
  const limit = params.limit ?? 6;

  return params.movies
    .filter((movie) => movie.genre === params.favoriteGenre)
    .filter((movie) => !watchedSet.has(movie.id))
    .slice(0, limit);
}
