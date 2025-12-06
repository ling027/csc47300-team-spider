import React, { useState, useMemo, useEffect } from 'react';
import './watchlist.css';
import '../main.css';
import NavBar from '../Component/Navbar';
import MinimalNavbar from '../Component/MinimalNavbar';
import { tmdb, type Movie as TmdbMovie } from '../../api/tmbd';
import { watchlistsAPI, type Watchlist, type WatchlistMovie } from '../../api/watchlists';
import { useAuth } from '../../context/AuthContext';

// Type definitions - using API types
interface WatchlistMovieLocal extends WatchlistMovie {
  id: number; // tmdbId for display purposes
}

interface WatchlistLocal {
  id: string; // MongoDB _id
  name: string;
  movies: WatchlistMovieLocal[];
}

interface ListStats {
  totalMovies: number;
  totalRuntime: string;
  avgRating: string;
  yearRange: string;
}

interface NewMovie {
  title: string;
  rating: number;
  review: string;
}

interface SelectedMovie {
  id: number;
  title: string;
  year: number;
  runtime: number;
  poster: string;
  tmdbId: number;
}

function getListStats(list: WatchlistLocal | undefined): ListStats {
  if (!list || !list.movies || list.movies.length === 0) {
    return {
      totalMovies: 0,
      totalRuntime: '0h 0m',
      avgRating: '0.0',
      yearRange: '—'
    };
  }

  // Calculate total movies
  const totalMovies = list.movies.length;

  // Calculate total runtime (sum of all runtimes in minutes)
  const totalRuntimeMinutes = list.movies.reduce((sum, movie) => {
    const runtime = typeof movie.runtime === 'number' ? movie.runtime : parseInt(String(movie.runtime)) || 0;
    return sum + runtime;
  }, 0);
  const hours = Math.floor(totalRuntimeMinutes / 60);
  const minutes = totalRuntimeMinutes % 60;
  const totalRuntime = `${hours}h ${minutes}m`;

  // Calculate average rating
  const totalRating = list.movies.reduce((sum, movie) => {
    const rating = typeof movie.rating === 'number' ? movie.rating : parseFloat(String(movie.rating)) || 0;
    return sum + rating;
  }, 0);
  const avgRating = (totalRating / totalMovies).toFixed(1);

  // Calculate year range
  const years = list.movies
    .map(movie => typeof movie.year === 'number' ? movie.year : parseInt(String(movie.year)))
    .filter(year => !isNaN(year));
  
  let yearRange = '—';
  if (years.length > 0) {
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    yearRange = minYear === maxYear ? `${minYear}` : `${minYear} - ${maxYear}`;
  }

  return {
    totalMovies,
    totalRuntime,
    avgRating,
    yearRange
  };
}

const renderStars = (rating: number): React.ReactElement[] => {
  const stars: React.ReactElement[] = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= rating ? 'stars' : 'star-empty'}>★</span>
    );
  }
  return stars;
};

function WatchList(): React.ReactElement {
  const { isLoggedIn } = useAuth();
  const [lists, setLists] = useState<WatchlistLocal[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [showNewListForm, setShowNewListForm] = useState<boolean>(false);
  const [newListName, setNewListName] = useState<string>("");
  const [showAddMovieForm, setShowAddMovieForm] = useState<boolean>(false);
  const [newMovie, setNewMovie] = useState<NewMovie>({
    title: '',
    rating: 0,
    review: ''
  });
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Movie search state
  const [movieSearchQuery, setMovieSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<TmdbMovie[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<SelectedMovie | null>(null);

  // Fetch watchlists on mount
  useEffect(() => {
    if (isLoggedIn) {
      fetchWatchlists();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const fetchWatchlists = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await watchlistsAPI.getAll();
      const transformedLists: WatchlistLocal[] = response.data.watchlists.map(w => ({
        id: w.id,
        name: w.name,
        movies: w.movies.map(m => ({
          ...m,
          id: m.tmdbId // Use tmdbId as id for display
        }))
      }));
      setLists(transformedLists);
      if (transformedLists.length > 0 && !selectedListId) {
        setSelectedListId(transformedLists[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load watchlists');
      console.error('Error fetching watchlists:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedList = lists.find(l => l.id === selectedListId);
  const stats = useMemo(() => getListStats(selectedList), [selectedList]);

  const toggleNewListForm = (): void => {
    setShowNewListForm(!showNewListForm);
  };

  const createNewList = async (): Promise<void> => {
    const name = newListName.trim();
    if (!name) return;

    try {
      setError(null);
      const response = await watchlistsAPI.create(name);
      const newList: WatchlistLocal = {
        id: response.data.watchlist.id,
        name: response.data.watchlist.name,
        movies: response.data.watchlist.movies.map(m => ({
          ...m,
          id: m.tmdbId
        }))
      };
      setLists([...lists, newList]);
      setNewListName('');
      setShowNewListForm(false);
      setSelectedListId(newList.id);
    } catch (err: any) {
      setError(err.message || 'Failed to create watchlist');
      console.error('Error creating watchlist:', err);
    }
  };

  const deleteList = async (event: React.MouseEvent<HTMLButtonElement>, listId: string): Promise<void> => {
    event.stopPropagation();
    if (lists.length <= 1) {
      alert('You must have at least one watchlist');
      return;
    }

    try {
      setError(null);
      await watchlistsAPI.delete(listId);
      const newLists = lists.filter(l => l.id !== listId);
      setLists(newLists);
      if (selectedListId === listId) {
        setSelectedListId(newLists[0]?.id || null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete watchlist');
      console.error('Error deleting watchlist:', err);
      alert(err.message || 'Failed to delete watchlist');
    }
  };

  const toggleAddMovieForm = (): void => {
    setShowAddMovieForm(!showAddMovieForm);
    if (!showAddMovieForm) {
      setNewMovie({
        title: '',
        rating: 0,
        review: ''
      });
      setMovieSearchQuery('');
      setSearchResults([]);
      setSelectedMovie(null);
      setIsSearching(false);
    }
  };

  const handleMovieInputChange = (field: keyof NewMovie, value: string | number): void => {
    setNewMovie(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStarClick = (rating: number): void => {
    setNewMovie(prev => ({
      ...prev,
      rating: rating
    }));
  };

  const toggleReviewExpansion = (movieId: number): void => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(movieId)) {
        newSet.delete(movieId);
      } else {
        newSet.add(movieId);
      }
      return newSet;
    });
  };

  // Search movies from TMDB API
  useEffect(() => {
    const searchMovies = async (): Promise<void> => {
      if (!movieSearchQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);
        const response = await tmdb.searchMovies(movieSearchQuery.trim(), 1);
        setSearchResults(response.results.slice(0, 5)); // Limit to 5 results
      } catch (error) {
        console.error('Error searching movies:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchMovies, 500); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [movieSearchQuery]);

  // Handle movie selection from search results
  const handleSelectMovie = async (movie: TmdbMovie): Promise<void> => {
    try {
      // Fetch full movie details to get runtime
      const movieDetails = await tmdb.getMovieDetails(movie.id);
      
      const year = movieDetails.release_date 
        ? new Date(movieDetails.release_date).getFullYear() 
        : new Date().getFullYear();
      
      setSelectedMovie({
        id: movieDetails.id,
        title: movieDetails.title,
        year: year,
        runtime: movieDetails.runtime || 120,
        poster: movieDetails.poster_path 
          ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
          : "https://via.placeholder.com/60x90/2b2b44/ffffff?text=No+Image",
        tmdbId: movieDetails.id
      });
      
      setNewMovie(prev => ({
        ...prev,
        title: movieDetails.title
      }));
      
      setMovieSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      alert('Failed to load movie details. Please try again.');
    }
  };

  const addMovieToList = async (): Promise<void> => {
    const { rating, review } = newMovie;
    
    if (!selectedListId) {
      alert('Please select a watchlist');
      return;
    }
    
    if (!selectedMovie && !newMovie.title.trim()) {
      alert('Please search and select a movie from the API, or enter a movie title');
      return;
    }
    
    if (rating === 0) {
      alert('Please provide a rating');
      return;
    }

    try {
      setError(null);
      const movieData = selectedMovie ? {
        tmdbId: selectedMovie.tmdbId,
        title: selectedMovie.title,
        year: selectedMovie.year,
        runtime: selectedMovie.runtime,
        rating: rating,
        review: review.trim(),
        poster: selectedMovie.poster
      } : {
        tmdbId: Date.now(), // Fallback ID for manual entries
        title: newMovie.title.trim(),
        year: new Date().getFullYear(),
        runtime: 120,
        rating: rating,
        review: review.trim(),
        poster: "https://via.placeholder.com/60x90/2b2b44/ffffff?text=No+Image"
      };

      await watchlistsAPI.addMovie(selectedListId, movieData);
      
      // Refresh watchlists
      await fetchWatchlists();
      
      setShowAddMovieForm(false);
      setNewMovie({
        title: '',
        rating: 0,
        review: ''
      });
      setMovieSearchQuery('');
      setSearchResults([]);
      setSelectedMovie(null);
    } catch (err: any) {
      setError(err.message || 'Failed to add movie');
      console.error('Error adding movie:', err);
      alert(err.message || 'Failed to add movie');
    }
  };

  return (
    <div className="watchlist-body-wrapper"> 
      <header className="site-header">
        <NavBar/>
      </header>

      <MinimalNavbar />

      <div className="container">
        <header>
          <h1>Your Watchlists</h1>
          {error && (
            <div style={{ color: '#ff5555', marginTop: '10px', padding: '10px', background: 'rgba(255, 85, 85, 0.1)', borderRadius: '4px' }}>
              {error}
            </div>
          )}
        </header>

        <div className="main-content">
          <aside className="sidebar">
            <div className="sidebar-card">
              <div className="sidebar-header">
                <h3>My Lists</h3>
                <button className="btn-add" onClick={toggleNewListForm}>+</button>
              </div>

              <div className={`new-list-form ${showNewListForm ? 'active' : ''}`}>
                <input 
                  type="text" 
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="New list name"
                />
                <button className="btn-create" onClick={createNewList}>Create List</button>
              </div>

              <div className="list-items">
                {loading ? (
                  <div style={{ padding: '1rem', textAlign: 'center', color: 'white' }}>Loading...</div>
                ) : lists.length === 0 ? (
                  <div style={{ padding: '1rem', textAlign: 'center', color: 'white' }}>No watchlists yet</div>
                ) : (
                  lists.map(list => (
                    <div 
                      key={list.id}
                      className={`list-item ${list.id === selectedListId ? 'active' : ''}`} 
                      onClick={() => setSelectedListId(list.id)}
                    >
                      <div className="list-item-info">
                        <div className="list-item-name">{list.name}</div>
                        <div className="list-item-count">{list.movies.length} movies</div>
                      </div>
                      {lists.length > 1 && (
                        <button className="btn-delete" onClick={(e) => deleteList(e, list.id)}>×</button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>

          {selectedList ? (
            <main key={selectedList.id} className="content"> 
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-icon" style={{ color: '#4f46e5' }}>🎬</span>
                    <span className="stat-label">Total Movies</span>
                  </div>
                  <div className="stat-value">{stats.totalMovies}</div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-icon" style={{ color: '#10b981' }}>⏱️</span>
                    <span className="stat-label">Total Runtime</span>
                  </div>
                  <div className="stat-value">{stats.totalRuntime}</div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-icon" style={{ color: '#fbbf24' }}>⭐</span>
                    <span className="stat-label">Avg Rating</span>
                  </div>
                  <div className="stat-value">{stats.avgRating} / 5</div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-icon" style={{ color: '#ec4899' }}>📅</span>
                    <span className="stat-label">Year Range</span>
                  </div>
                  <div className="stat-value medium">{stats.yearRange}</div>
                </div>
              </div>

              <div className="movies-card">
                <div className="movies-card-header">
                  <h2>{selectedList.name}</h2>
                  <button className="btn-add-movie" onClick={toggleAddMovieForm}>
                    + Add Movie
                  </button>
                </div>

                {showAddMovieForm && (
                  <div className="add-movie-form">
                    <h3>Add New Movie</h3>
                    
                    <div className="form-group">
                      <label>Search Movie from TMDB *</label>
                      <input
                        type="text"
                        value={movieSearchQuery}
                        onChange={(e) => setMovieSearchQuery(e.target.value)}
                        placeholder="Search for a movie..."
                        disabled={!!selectedMovie}
                      />
                      {isSearching && (
                        <div className="search-status">
                          Searching...
                        </div>
                      )}
                      {!selectedMovie && searchResults.length > 0 && (
                        <div className="movie-search-results">
                          {searchResults.map((movie) => (
                            <div
                              key={movie.id}
                              className="movie-search-result-item"
                              onClick={() => handleSelectMovie(movie)}
                            >
                              {movie.poster_path && (
                                <img
                                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                  alt={movie.title}
                                  className="movie-search-result-poster"
                                />
                              )}
                              <div>
                                <div className="movie-search-result-title">{movie.title}</div>
                                {movie.release_date && (
                                  <div className="movie-search-result-year">
                                    {new Date(movie.release_date).getFullYear()}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {selectedMovie && (
                        <div className="movie-selected">
                          <img
                            src={selectedMovie.poster}
                            alt={selectedMovie.title}
                            className="movie-selected-poster"
                          />
                          <div className="movie-selected-info">
                            <div className="movie-selected-title">{selectedMovie.title}</div>
                            <div className="movie-selected-details">
                              {selectedMovie.year} • {selectedMovie.runtime} min
                            </div>
                          </div>
                          <button
                            className="btn-clear-movie"
                            onClick={() => {
                              setSelectedMovie(null);
                              setMovieSearchQuery('');
                              setNewMovie(prev => ({ ...prev, title: '' }));
                            }}
                          >
                            Clear
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Or Enter Movie Title Manually</label>
                      <input
                        type="text"
                        value={newMovie.title}
                        onChange={(e) => handleMovieInputChange('title', e.target.value)}
                        placeholder="Enter movie title manually"
                        disabled={!!selectedMovie}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Rating *</label>
                      <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`star ${star <= newMovie.rating ? 'filled' : ''}`}
                            onClick={() => handleStarClick(star)}
                          >
                            ★
                          </span>
                        ))}
                        <span className="rating-text">
                          {newMovie.rating > 0 ? `${newMovie.rating} star${newMovie.rating > 1 ? 's' : ''}` : 'Click to rate'}
                        </span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Review (optional)</label>
                      <textarea
                        value={newMovie.review}
                        onChange={(e) => handleMovieInputChange('review', e.target.value)}
                        placeholder="Write your review here..."
                        rows={3}
                        maxLength={500}
                      />
                      <div className="char-count">
                        {newMovie.review.length}/500 characters
                      </div>
                    </div>

                    <div className="form-actions">
                      <button className="btn-cancel" onClick={toggleAddMovieForm}>
                        Cancel
                      </button>
                      <button className="btn-save" onClick={addMovieToList}>
                        Add Movie
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  {selectedList.movies.length === 0 ? (
                    <table>
                      <thead>
                        <tr>
                          <th>Poster</th>
                          <th>Title</th>
                          <th>Year</th>
                          <th>Runtime</th>
                          <th>Rating</th>
                          <th>Review</th>
                          <th className="right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan={7} className="empty-state">
                            <div className="empty-icon">🎬</div>
                            <p>No movies in this list yet</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Poster</th>
                          <th>Title</th>
                          <th>Year</th>
                          <th>Runtime</th>
                          <th>Rating</th>
                          <th>Review</th>
                          <th className="right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedList.movies.map(movie => (
                          <React.Fragment key={movie.id}>
                            <tr>
                              <td className="movie-poster-cell">
                                <img 
                                  src={movie.poster} 
                                  alt={`${movie.title} poster`}
                                  className="movie-poster"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/60x90/2b2b44/ffffff?text=No+Image";
                                  }}
                                />
                              </td>
                              <td>{movie.title}</td>
                              <td className="secondary">{movie.year}</td>
                              <td className="secondary">{movie.runtime} min</td>
                              <td>{renderStars(movie.rating)}</td>
                              <td className="review-cell">
                                {movie.review ? (
                                  <div className="review-dropdown">
                                    <button 
                                      className="review-toggle"
                                      onClick={() => toggleReviewExpansion(movie.id)}
                                    >
                                      <span className="has-review">Yes</span>
                                      <span className={`dropdown-arrow ${expandedReviews.has(movie.id) ? 'expanded' : ''}`}>
                                        ▼
                                      </span>
                                    </button>
                                  </div>
                                ) : (
                                  <span className="no-review">No</span>
                                )}
                              </td>
                              <td className="right">
                                <button 
                                  className="btn-remove" 
                                  onClick={async () => {
                                    if (!selectedListId) return;
                                    try {
                                      setError(null);
                                      await watchlistsAPI.removeMovie(selectedListId, movie.id);
                                      await fetchWatchlists();
                                    } catch (err: any) {
                                      setError(err.message || 'Failed to remove movie');
                                      console.error('Error removing movie:', err);
                                      alert(err.message || 'Failed to remove movie');
                                    }
                                  }}
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                            {movie.review && expandedReviews.has(movie.id) && (
                              <tr className="review-row">
                                <td colSpan={6} className="review-content-cell">
                                  <div className="review-content">
                                    <p>{movie.review}</p>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </main>
          ) : (
            <main key="empty-state" className="content">
              <div className="movies-card">
                <div className="empty-state">
                  <div className="empty-icon">🎬</div>
                  <p>Create or select a list to get started!</p>
                </div>
              </div>
            </main>
          )}
        </div>
      </div>
    </div>
  );
}

export default WatchList;

