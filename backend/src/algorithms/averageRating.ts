export interface RatedMovieInput {
  genre: string;
  score: number;
}

export function calculateAverageRating(scores: number[]): number {
  if (!scores.length) return 0;
  const total = scores.reduce((sum, score) => sum + score, 0);
  return Number((total / scores.length).toFixed(2));
}

export function calculateAverageRatingByGenre(
  ratedMovies: RatedMovieInput[],
): Record<string, number> {
  const grouped: Record<string, number[]> = {};

  for (const movie of ratedMovies) {
    if (!grouped[movie.genre]) {
      grouped[movie.genre] = [];
    }
    grouped[movie.genre].push(movie.score);
  }

  const result: Record<string, number> = {};
  for (const genre of Object.keys(grouped)) {
    result[genre] = calculateAverageRating(grouped[genre]);
  }

  return result;
}
