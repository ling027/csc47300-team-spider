const TMBD_BASE = "https://api.themoviedb.org/3";

type IsoDate = string;

export interface Movie {
    id: number;
    title: string;
    overview: string;
    release_date: IsoDate;
    poster_path: string | null;
    vote_average: number;
    genre_ids?: number[];
  }

  export interface Genre {
    id: number;
    name: string;
  }

  export interface Cast {
    id: number;
    name: string;
    character: string;
    order: number;
  }

  export interface Crew {
    id: number;
    name: string;
    job: string;
    department: string;
  }

  export interface Credits {
    cast: Cast[];
    crew: Crew[];
  }

  export interface ProductionCompany {
    id: number;
    name: string;
  }

  export interface Video {
    id: string;
    key: string;
    name: string;
    site: string;
    size: number;
    type: string;
  }

  export interface VideosResponse {
    id: number;
    results: Video[];
  }

  export interface MovieDetails extends Movie {
    genres: Genre[];
    runtime: number | null;
    credits?: Credits;
    production_companies?: ProductionCompany[];
  }

  export interface PagedResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
  }

  export interface GenresResponse {
    genres: Genre[];
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
        tmdbFetch<PagedResponse<Movie>>("/movie/upcoming", { page }),

    getMovieDetails: async (id: number): Promise<MovieDetails & { credits: Credits }> => {
      // Fetch movie details with credits in one call using append_to_response
      const details = await tmdbFetch<MovieDetails & { credits: Credits }>(`/movie/${id}`, { 
        append_to_response: 'credits'
      });
      return details;
    },

    getMovieVideos: (id: number) =>
      tmdbFetch<VideosResponse>(`/movie/${id}/videos`),

    getGenres: () =>
      tmdbFetch<GenresResponse>("/genre/movie/list"),

    discoverMoviesByGenre: (genreId: number, page = 1) =>
      tmdbFetch<PagedResponse<Movie>>("/discover/movie", { with_genres: genreId, page })
  };

