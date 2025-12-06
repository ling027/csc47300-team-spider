import apiClient from './apiClient';

export interface WatchlistMovie {
  tmdbId: number;
  title: string;
  year: number;
  runtime: number;
  rating: number;
  review?: string;
  poster: string;
}

export interface Watchlist {
  id: string;
  name: string;
  movies: WatchlistMovie[];
  movieCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface WatchlistResponse {
  status: string;
  data: {
    watchlists: Watchlist[];
  };
}

export interface SingleWatchlistResponse {
  status: string;
  data: {
    watchlist: Watchlist;
  };
}

export interface AddMovieData {
  tmdbId: number;
  title: string;
  year: number;
  runtime: number;
  rating: number;
  review?: string;
  poster: string;
}

export const watchlistsAPI = {
  getAll: async (): Promise<WatchlistResponse> => {
    const response = await apiClient.get('/watchlists');
    return response.data;
  },

  getById: async (id: string): Promise<SingleWatchlistResponse> => {
    const response = await apiClient.get(`/watchlists/${id}`);
    return response.data;
  },

  create: async (name: string): Promise<SingleWatchlistResponse> => {
    const response = await apiClient.post('/watchlists', { name });
    return response.data;
  },

  update: async (id: string, name: string): Promise<SingleWatchlistResponse> => {
    const response = await apiClient.put(`/watchlists/${id}`, { name });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/watchlists/${id}`);
  },

  addMovie: async (watchlistId: string, movie: AddMovieData): Promise<{ status: string; data: { movie: WatchlistMovie } }> => {
    const response = await apiClient.post(`/watchlists/${watchlistId}/movies`, movie);
    return response.data;
  },

  removeMovie: async (watchlistId: string, movieTmdbId: number): Promise<void> => {
    await apiClient.delete(`/watchlists/${watchlistId}/movies/${movieTmdbId}`);
  }
};


