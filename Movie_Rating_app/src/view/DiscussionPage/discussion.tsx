import React, { useState } from 'react';
import './discussion.css';
import '../main.css';
import NavBar from '../Component/Navbar.jsx';

// Type definitions
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
}

interface NewThreadForm {
  title: string;
  movie: string;
  content: string;
  tags: string;
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
    content: "Just rewatched Inception and I'm still blown away by the complexity of the dream layers. What do you think about the ending - was Cobb still dreaming?"
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
    content: "The multiverse concept in EEAAO is fascinating. Do you think the hot dog fingers universe was the most creative one?"
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
    content: "With the new Spider-Man movie coming in 2026, what do you think the story will focus on? Any theories about the villain?"
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

  const toggleNewThreadForm = (): void => {
    setShowNewThreadForm(!showNewThreadForm);
    if (!showNewThreadForm) {
      setNewThread({
        title: '',
        movie: '',
        content: '',
        tags: ''
      });
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

  const createNewThread = (): void => {
    const { title, movie, content, tags } = newThread;
    
    if (!title.trim() || !movie.trim() || !content.trim()) {
      alert('Please fill in all required fields (title, movie, and content)');
      return;
    }

    const threadToAdd: Thread = {
      id: Date.now(),
      title: title.trim(),
      movie: movie.trim(),
      author: "You",
      replies: 0,
      views: 1,
      lastActivity: "Just now",
      tags: tags.trim() ? tags.split(',').map(tag => tag.trim()) : [],
      content: content.trim()
    };

    setThreads([threadToAdd, ...threads]);
    setShowNewThreadForm(false);
    setNewThread({
      title: '',
      movie: '',
      content: '',
      tags: ''
    });
  };

  return (
    <div className="discussion-body-wrapper">
      <header className="site-header">
        <NavBar/>
      </header>
      
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
                  <label>Movie *</label>
                  <input
                    type="text"
                    value={newThread.movie}
                    onChange={(e) => handleInputChange('movie', e.target.value)}
                    placeholder="Enter movie name"
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
                        <div className="thread-actions">
                          <button className="btn-reply">Reply</button>
                          <button className="btn-like">👍 Like</button>
                          <button className="btn-share">Share</button>
                        </div>
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

