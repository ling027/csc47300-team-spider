import React, { useState, useEffect } from 'react';
import './discussion.css';
import '../main.css';
import NavBar from '../Component/Navbar';
import MinimalNavbar from '../Component/MinimalNavbar';
import { tmdb, type Movie as TmdbMovie } from '../../api/tmbd';

// Type definitions
interface Reply {
  id: number;
  author: string;
  content: string;
  timestamp: string;
}

interface Thread {
  id: number;
  title: string;
  movie: string;
  author: string;
  replies: number;
  views: number;
  lastActivity: string;
  tags: string[];
  content: string;
  replyList: Reply[];
}

interface NewThreadForm {
  title: string;
  movie: string;
  content: string;
  tags: string;
}

interface SelectedMovie {
  id: number;
  title: string;
  year: number;
  runtime: number;
  poster: string;
  tmdbId: number;
}

const initialThreads: Thread[] = [
  {
    id: 1,
    title: "Inception - Mind-bending masterpiece discussion",
    movie: "Inception",
    author: "MovieBuff2024",
    replies: 23,
    views: 156,
    lastActivity: "2 hours ago",
    tags: ["Christopher Nolan", "Sci-Fi", "Leonardo DiCaprio"],
    content: "Just rewatched Inception and I'm still blown away by the complexity of the dream layers. What do you think about the ending - was Cobb still dreaming?",
    replyList: []
  },
  {
    id: 2,
    title: "Everything Everywhere All at Once - Multiverse theories",
    movie: "Everything Everywhere All at Once",
    author: "SciFiFan",
    replies: 18,
    views: 89,
    lastActivity: "5 hours ago",
    tags: ["Multiverse", "Michelle Yeoh", "Philosophy"],
    content: "The multiverse concept in EEAAO is fascinating. Do you think the hot dog fingers universe was the most creative one?",
    replyList: []
  },
  {
    id: 3,
    title: "Spider-Man: Brand New Day - Predictions and theories",
    movie: "Spider-Man: Brand New Day",
    author: "WebHead",
    replies: 31,
    views: 203,
    lastActivity: "1 day ago",
    tags: ["Marvel", "Spider-Man", "Predictions"],
    content: "With the new Spider-Man movie coming in 2026, what do you think the story will focus on? Any theories about the villain?",
    replyList: []
  }
];

function DiscussionPage(): React.ReactElement {
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [showNewThreadForm, setShowNewThreadForm] = useState<boolean>(false);
  const [expandedThreads, setExpandedThreads] = useState<Set<number>>(new Set());
  const [newThread, setNewThread] = useState<NewThreadForm>({
    title: '',
    movie: '',
    content: '',
    tags: ''
  });
  const [movieSearchQuery, setMovieSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<TmdbMovie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<SelectedMovie | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [replyingToThread, setReplyingToThread] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');

  const toggleNewThreadForm = (): void => {
    setShowNewThreadForm(!showNewThreadForm);
    if (!showNewThreadForm) {
      setNewThread({
        title: '',
        movie: '',
        content: '',
        tags: ''
      });
      setMovieSearchQuery('');
      setSearchResults([]);
      setSelectedMovie(null);
      setIsSearching(false);
    }
  };

  const toggleThreadExpansion = (threadId: number): void => {
    setExpandedThreads(prev => {
      const newSet = new Set(prev);
      if (newSet.has(threadId)) {
        newSet.delete(threadId);
      } else {
        newSet.add(threadId);
      }
      return newSet;
    });
  };

  const handleInputChange = (field: keyof NewThreadForm, value: string): void => {
    setNewThread(prev => ({
      ...prev,
      [field]: value
    }));
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
      
      setNewThread(prev => ({
        ...prev,
        movie: movieDetails.title
      }));
      
      setMovieSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      alert('Failed to load movie details. Please try again.');
    }
  };

  const createNewThread = (): void => {
    const { title, content, tags } = newThread;
    const movieTitle = selectedMovie ? selectedMovie.title : newThread.movie.trim();
    
    if (!title.trim() || !movieTitle || !content.trim()) {
      alert('Please fill in all required fields (title, movie, and content)');
      return;
    }

    const threadToAdd: Thread = {
      id: Date.now(),
      title: title.trim(),
      movie: movieTitle,
      author: "You",
      replies: 0,
      views: 1,
      lastActivity: "Just now",
      tags: tags.trim() ? tags.split(',').map(tag => tag.trim()) : [],
      content: content.trim(),
      replyList: []
    };

    setThreads([threadToAdd, ...threads]);
    setShowNewThreadForm(false);
    setNewThread({
      title: '',
      movie: '',
      content: '',
      tags: ''
    });
    setMovieSearchQuery('');
    setSearchResults([]);
    setSelectedMovie(null);
  };

  const handleReplyClick = (threadId: number): void => {
    setReplyingToThread(threadId);
    setReplyContent('');
  };

  const handleCancelReply = (): void => {
    setReplyingToThread(null);
    setReplyContent('');
  };

  const handleSubmitReply = (threadId: number): void => {
    if (!replyContent.trim()) {
      alert('Please enter a reply');
      return;
    }

    const newReply: Reply = {
      id: Date.now(),
      author: 'You',
      content: replyContent.trim(),
      timestamp: 'Just now'
    };

    setThreads(prevThreads => 
      prevThreads.map(thread => {
        if (thread.id === threadId) {
          return {
            ...thread,
            replies: thread.replies + 1,
            lastActivity: 'Just now',
            replyList: [...thread.replyList, newReply]
          };
        }
        return thread;
      })
    );

    setReplyingToThread(null);
    setReplyContent('');
  };

  return (
    <div className="discussion-body-wrapper">
      <header className="site-header">
        <NavBar/>
      </header>

      <MinimalNavbar />

      <div className="container">
        <header>
          <h1>Movie Discussions</h1>
        </header>

        <div className="main-content">
          <aside className="sidebar">
            <div className="sidebar-card">
              <div className="sidebar-header">
                <h3>Discussion Stats</h3>
              </div>
              <div className="sidebar-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Threads</span>
                  <span className="stat-value">{threads.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Replies</span>
                  <span className="stat-value">{threads.reduce((sum, thread) => sum + thread.replies, 0)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Views</span>
                  <span className="stat-value">{threads.reduce((sum, thread) => sum + thread.views, 0)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Active Users</span>
                  <span className="stat-value">12</span>
                </div>
              </div>
            </div>
          </aside>

          <div className="discussion-content">
            <div className="discussion-header">
              <h2>Latest Discussions</h2>
              <button className="btn-create-thread" onClick={toggleNewThreadForm}>
                + New Thread
              </button>
            </div>

            {showNewThreadForm && (
              <div className="new-thread-form">
                <h3>Create New Discussion</h3>
                <div className="form-group">
                  <label>Thread Title *</label>
                  <input
                    type="text"
                    value={newThread.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter discussion title"
                  />
                </div>
                
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
                          setNewThread(prev => ({ ...prev, movie: '' }));
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
                    value={newThread.movie}
                    onChange={(e) => handleInputChange('movie', e.target.value)}
                    placeholder="Enter movie title manually"
                    disabled={!!selectedMovie}
                  />
                </div>

                <div className="form-group">
                  <label>Discussion Content *</label>
                  <textarea
                    value={newThread.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Start your discussion..."
                    rows={4}
                    maxLength={1000}
                  />
                  <div className="char-count">
                    {newThread.content.length}/1000 characters
                  </div>
                </div>

                <div className="form-group">
                  <label>Tags (optional)</label>
                  <input
                    type="text"
                    value={newThread.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="Enter tags separated by commas"
                  />
                </div>

                <div className="form-actions">
                  <button className="btn-cancel" onClick={toggleNewThreadForm}>
                    Cancel
                  </button>
                  <button className="btn-save" onClick={createNewThread}>
                    Create Thread
                  </button>
                </div>
              </div>
            )}

            <div className="threads-list">
              {threads.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">💬</div>
                  <p>No discussions yet. Start the conversation!</p>
                </div>
              ) : (
                threads.map(thread => (
                  <div key={thread.id} className="thread-card">
                    <div 
                      className="thread-header clickable"
                      onClick={() => toggleThreadExpansion(thread.id)}
                    >
                      <div className="thread-title-row">
                        <h3 className="thread-title">{thread.title}</h3>
                        <span className={`expand-arrow ${expandedThreads.has(thread.id) ? 'expanded' : ''}`}>
                          ▼
                        </span>
                      </div>
                      <div className="thread-meta">
                        <span className="thread-movie">{thread.movie}</span>
                        <span className="thread-author">by {thread.author}</span>
                      </div>
                    </div>
                    
                    <div className="thread-content">
                      <p>{thread.content}</p>
                    </div>

                    <div className="thread-tags">
                      {thread.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>

                    <div className="thread-stats">
                      <div className="stat">
                        <span className="stat-icon">💬</span>
                        <span>{thread.replies} replies</span>
                      </div>
                      <div className="stat">
                        <span className="stat-icon">👁️</span>
                        <span>{thread.views} views</span>
                      </div>
                      <div className="stat">
                        <span className="stat-icon">⏰</span>
                        <span>{thread.lastActivity}</span>
                      </div>
                    </div>

                    {expandedThreads.has(thread.id) && (
                      <div className="thread-expanded-content">
                        {/* Display existing replies */}
                        {thread.replyList.length > 0 && (
                          <div className="replies-list">
                            <h4 className="replies-header">Replies ({thread.replyList.length})</h4>
                            {thread.replyList.map(reply => (
                              <div key={reply.id} className="reply-item">
                                <div className="reply-header">
                                  <span className="reply-author">{reply.author}</span>
                                  <span className="reply-timestamp">{reply.timestamp}</span>
                                </div>
                                <div className="reply-content">{reply.content}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply form */}
                        {replyingToThread === thread.id ? (
                          <div className="reply-form">
                            <textarea
                              className="reply-textarea"
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder="Write your reply..."
                              rows={3}
                            />
                            <div className="reply-actions">
                              <button className="btn-cancel" onClick={handleCancelReply}>
                                Cancel
                              </button>
                              <button className="btn-submit" onClick={() => handleSubmitReply(thread.id)}>
                                Submit Reply
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="thread-actions">
                            <button className="btn-reply" onClick={() => handleReplyClick(thread.id)}>
                              Reply
                            </button>
                            <button className="btn-like">👍 Like</button>
                            <button className="btn-share">Share</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscussionPage;

