import React, { useState, useMemo, useEffect } from 'react';
import './watchlist.css';
import '../main.css';
import NavBar from '../Component/Navbar.jsx';
import { movies, upcomingMovies } from '../MovieDetailPage/movies.js';
import { tmdb } from '../../api/tmbd.js';

const initialListsData = [
  {
    id: 1,
    name: "Must Watch",
    movies: [
      { 
        id: movies[0].id, 
        title: movies[0].title, 
        year: movies[0].releaseDate ? new Date(movies[0].releaseDate).getFullYear() : 2010, 
        rating: 5, 
        runtime: parseInt(movies[0].length) || 145,
        poster: movies[0].poster,
        review: "Inception is, without a doubt, one of my favourite movies of all time. Directed by Christopher Nolan, this film delivers a unique blend of mind-bending storytelling, impeccable performances, and stunning visuals that have left a lasting impression on me. From the moment I first watched it, I was captivated by its intricate plot and the way it challenges the audience to think deeply about the nature of reality and dreams."
      },
      { 
        id: upcomingMovies[0].id, 
        title: upcomingMovies[0].title, 
        year: upcomingMovies[0].releaseDate ? new Date(upcomingMovies[0].releaseDate).getFullYear() : 2026, 
        rating: 5, 
        runtime: parseInt(upcomingMovies[0].length) || 165,
        poster: upcomingMovies[0].poster
      }
    ]
  },
  {
    id: 2,
    name: "Sci-Fi Classics",
    movies: [
      { 
        id: movies[0].id, 
        title: movies[0].title, 
        year: movies[0].releaseDate ? new Date(movies[0].releaseDate).getFullYear() : 2010, 
        rating: 5, 
        runtime: parseInt(movies[0].length) || 145,
        poster: movies[0].poster
      },
      { 
        id: movies[2].id, 
        title: movies[2].title, 
        year: movies[2].DOR ? parseInt(movies[2].DOR) : 2022, 
        rating: 3, 
        runtime: parseInt(movies[2].length) || 139,
        poster: movies[2].poster
      }
    ]
  },
  {
    id: 3,
    name: "Coming Soon",
    movies: [
      { 
        id: upcomingMovies[1].id, 
        title: upcomingMovies[1].title, 
        year: upcomingMovies[1].releaseDate ? new Date(upcomingMovies[1].releaseDate).getFullYear() : 2026, 
        rating: 4, 
        runtime: parseInt(upcomingMovies[1].length) || 130,
        poster: upcomingMovies[1].poster
      },
      { 
        id: upcomingMovies[2].id, 
        title: upcomingMovies[2].title, 
        year: upcomingMovies[2].releaseDate ? new Date(upcomingMovies[2].releaseDate).getFullYear() : 2026, 
        rating: 4, 
        runtime: parseInt(upcomingMovies[2].length) || 170,
        poster: upcomingMovies[2].poster
      }
    ]
  }
];

function getListStats(list) {
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
    const runtime = typeof movie.runtime === 'number' ? movie.runtime : parseInt(movie.runtime) || 0;
    return sum + runtime;
  }, 0);
  const hours = Math.floor(totalRuntimeMinutes / 60);
  const minutes = totalRuntimeMinutes % 60;
  const totalRuntime = `${hours}h ${minutes}m`;

  // Calculate average rating
  const totalRating = list.movies.reduce((sum, movie) => {
    const rating = typeof movie.rating === 'number' ? movie.rating : parseFloat(movie.rating) || 0;
    return sum + rating;
  }, 0);
  const avgRating = (totalRating / totalMovies).toFixed(1);

  // Calculate year range
  const years = list.movies
    .map(movie => typeof movie.year === 'number' ? movie.year : parseInt(movie.year))
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
const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= rating ? 'stars' : 'star-empty'}>★</span>
    );
  }
  return stars;
};
function WatchList() {
  const [lists, setLists] = useState(initialListsData);
  const [selectedListId, setSelectedListId] = useState(1);
  const [showNewListForm, setShowNewListForm] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [showAddMovieForm, setShowAddMovieForm] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    rating: 0,
    review: ''
  });
  const [expandedReviews, setExpandedReviews] = useState(new Set());
  
  // Movie search state
  const [movieSearchQuery, setMovieSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const selectedList = lists.find(l => l.id === selectedListId);
  const stats = useMemo(() => getListStats(selectedList), [selectedList]);

  const toggleNewListForm = () => {
    setShowNewListForm(!showNewListForm);
  };

  const createNewList = () => {
    const name = newListName.trim();
    if (name) {
      const nextListId = (lists.length ? Math.max(...lists.map(l => l.id)) : 0) + 1;
      const newList = { id: nextListId, name: name, movies: [] };
      setLists([...lists, newList]);
      setNewListName('');
      setShowNewListForm(false);
      setSelectedListId(newList.id);
    }
  };

  const deleteList = (event, listId) => {
    event.stopPropagation();
    if (lists.length > 1) {
      const newLists = lists.filter(l => l.id !== listId);
      setLists(newLists);
      if (selectedListId === listId) {
        setSelectedListId(newLists[0].id);
      }
    }
  };

  const toggleAddMovieForm = () => {
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

  const handleMovieInputChange = (field, value) => {
    setNewMovie(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStarClick = (rating) => {
    setNewMovie(prev => ({
      ...prev,
      rating: rating
    }));
  };

  const toggleReviewExpansion = (movieId) => {
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
    const searchMovies = async () => {
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
  const handleSelectMovie = async (movie) => {
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

  const addMovieToList = () => {
    const { rating, review } = newMovie;
    
    if (!selectedMovie && !newMovie.title.trim()) {
      alert('Please search and select a movie from the API, or enter a movie title');
      return;
    }
    
    if (rating === 0) {
      alert('Please provide a rating');
      return;
    }

    const movieToAdd = selectedMovie ? {
      id: selectedMovie.tmdbId, // Use TMDB ID as the unique identifier
      title: selectedMovie.title,
      year: selectedMovie.year,
      runtime: selectedMovie.runtime,
      rating: rating,
      review: review.trim(),
      poster: selectedMovie.poster
    } : {
      id: Date.now(),
      title: newMovie.title.trim(),
      year: new Date().getFullYear(),
      runtime: 120,
      rating: rating,
      review: review.trim(),
      poster: "https://via.placeholder.com/60x90/2b2b44/ffffff?text=No+Image"
    };

    const updatedLists = lists.map(list => {
      if (list.id === selectedListId) {
        return {
          ...list,
          movies: [...list.movies, movieToAdd]
        };
      }
      return list;
    });

    setLists(updatedLists);
    setShowAddMovieForm(false);
    setNewMovie({
      title: '',
      rating: 0,
      review: ''
    });
    setMovieSearchQuery('');
    setSearchResults([]);
    setSelectedMovie(null);
  };

  return (
    <div className="watchlist-body-wrapper"> 
      <header className="site-header">
        <NavBar/>
      </header>
      
      <div className="container">
        <header>
          <h1>Your Watchlists</h1>
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
                {lists.map(list => (
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
                ))}
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
                            onMouseEnter={() => {
                            }}
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
                        rows="3"
                        maxLength="500"
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
                          <td colSpan="7" className="empty-state">
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
                                    e.target.src = "https://via.placeholder.com/60x90/2b2b44/ffffff?text=No+Image";
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
                                  onClick={() => {
                                    const updatedLists = lists.map(list => {
                                      if (list.id === selectedListId) {
                                        return {
                                          ...list,
                                          movies: list.movies.filter(m => m.id !== movie.id)
                                        };
                                      }
                                      return list;
                                    });
                                    setLists(updatedLists);
                                  }}
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                            {movie.review && expandedReviews.has(movie.id) && (
                              <tr className="review-row">
                                <td colSpan="6" className="review-content-cell">
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