import React, { useState, useMemo } from 'react';
import './watchlist.css'; 
import NavBar from '../Component/Navbar.jsx';
import { movies, upcomingMovies } from '../MovieDetailPage/movies.js';

// --- Data and Helper Functions (Unchanged) ---
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
        runtime: parseInt(movies[0].length) || 145 
      },
      { 
        id: upcomingMovies[0].id, 
        title: upcomingMovies[0].title, 
        year: upcomingMovies[0].releaseDate ? new Date(upcomingMovies[0].releaseDate).getFullYear() : 2026, 
        rating: 5, 
        runtime: parseInt(upcomingMovies[0].length) || 165 
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
        runtime: parseInt(movies[0].length) || 145 
      },
      { 
        id: movies[2].id, 
        title: movies[2].title, 
        year: movies[2].DOR ? parseInt(movies[2].DOR) : 2022, 
        rating: 3, 
        runtime: parseInt(movies[2].length) || 139 
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
        runtime: parseInt(upcomingMovies[1].length) || 130 
      },
      { 
        id: upcomingMovies[2].id, 
        title: upcomingMovies[2].title, 
        year: upcomingMovies[2].releaseDate ? new Date(upcomingMovies[2].releaseDate).getFullYear() : 2026, 
        rating: 4, 
        runtime: parseInt(upcomingMovies[2].length) || 170 
      }
    ]
  }
];

function getListStats(list) {
  if (!list || list.movies.length === 0) {
    return {
      totalMovies: 0,
      totalRuntime: '0h 0m',
      avgRating: '0.0',
      yearRange: '-'
    };
  }
  const totalRuntime = list.movies.reduce((sum, movie) => sum + movie.runtime, 0);
  const avgRating = list.movies.reduce((sum, movie) => sum + movie.rating, 0) / list.movies.length;
  const hours = Math.floor(totalRuntime / 60);
  const minutes = totalRuntime % 60;
  const years = list.movies.map(m => m.year);
  return {
    totalMovies: list.movies.length,
    totalRuntime: `${hours}h ${minutes}m`,
    avgRating: avgRating.toFixed(1),
    yearRange: `${Math.min(...years)} - ${Math.max(...years)}`
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
// --- End of Unchanged Code ---


// --- React Component ---
function WatchList() {
  const [lists, setLists] = useState(initialListsData);
  const [selectedListId, setSelectedListId] = useState(1);
  const [showNewListForm, setShowNewListForm] = useState(false);
  const [newListName, setNewListName] = useState("");

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

  return (
    <div className="watchlist-body-wrapper"> 
      <header className="main-nav-header">
        <NavBar/>
      </header>
      
      <div className="container">
        <header>
          <h1>Your Watchlists</h1>
        </header>

        <div className="main-content">
          {/* Sidebar */}
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
                    key={list.id} // This key is correct
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

          {/* HERE IS THE FIX: 
            We add a 'key' prop to the <main> element.
          */}
          {selectedList ? (
            <main key={selectedList.id} className="content"> 
              {/* Stats Grid */}
              <div className="stats-grid">
                {/* ... (stat cards) ... */}
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

              {/* Movies Table */}
              <div className="movies-card">
                <h2>{selectedList.name}</h2>
                <div>
                  {selectedList.movies.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">🎬</div>
                      <p>No movies in this list yet</p>
                    </div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Year</th>
                          <th>Runtime</th>
                          <th>Rating</th>
                          <th className="right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedList.movies.map(movie => (
                          <tr key={movie.id}> {/* This key is also correct */}
                            <td>{movie.title}</td>
                            <td className="secondary">{movie.year}</td>
                            <td className="secondary">{movie.runtime} min</td>
                            <td>{renderStars(movie.rating)}</td>
                            <td className="right">
                              <button className="btn-remove">Remove</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </main>
          ) : (
            <main key="empty-state" className="content"> {/* Added key here too */}
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