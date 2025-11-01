const TMBD_BASE = "https://api.themoviedb.org/3";

type IsoDate = string;

export interface Movie {
    id: number;
    title: string;
    overview: string;
    release_date: IsoDate;
    poster_path: string | null;
    vote_average: number;
  }

  export interface PagedResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
  }

  async function tmdbFetch<T>(
    path: string,
    params: Record<string, string | number> = {}
  ): Promise<T> {
    const url = new URL(`${TMBD_BASE}${path}`);
    url.searchParams.set("api_key", import.meta.env.VITE_TMDB_API_KEY);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  
    const res = await fetch(url.toString());
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`TMDB ${res.status}: ${text}`);
    }
    return res.json() as Promise<T>;
  }
  
  export const tmdb = {
    trendingMovies: (page = 1) =>
      tmdbFetch<PagedResponse<Movie>>("/trending/movie/week", { page }),
    movieById: (id: number) => tmdbFetch<Movie>(`/movie/${id}`),
    searchMovies: (q: string, page = 1) =>
      tmdbFetch<PagedResponse<Movie>>("/search/movie", { query: q, page }),

    getUpcomingMovies: (page = 1) =>
        tmdbFetch<PagedResponse<Movie>>("/movie/upcoming", { page })
  };

