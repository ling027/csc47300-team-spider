import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin';
import NavBar from '../Component/Navbar';
import './admin.css';

interface Reply {
  id: string;
  userId: any;
  author: string;
  content: string;
  timestamp: Date;
}

interface DiscussionDetailViewProps {
  discussionId: string;
  onBack: () => void;
}

const DiscussionDetailView: React.FC<DiscussionDetailViewProps> = ({ discussionId, onBack }) => {
  const [thread, setThread] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDiscussion();
  }, [discussionId]);

  const loadDiscussion = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getDiscussion(discussionId);
      setThread(response.data.thread);
    } catch (err: any) {
      setError(err.message || 'Failed to load discussion');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteThread = async () => {
    if (!thread) return;
    if (!window.confirm(`Are you sure you want to delete this discussion thread?`)) return;

    try {
      setLoading(true);
      await adminAPI.deleteDiscussion(discussionId);
      alert('Discussion deleted successfully');
      onBack();
    } catch (err: any) {
      setError(err.message || 'Failed to delete discussion');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (!window.confirm('Are you sure you want to delete this reply?')) return;

    try {
      setLoading(true);
      await adminAPI.deleteReply(discussionId, replyId);
      loadDiscussion(); // Reload to refresh replies
    } catch (err: any) {
      setError(err.message || 'Failed to delete reply');
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreThread = async () => {
    if (!thread) return;
    if (!window.confirm(`Are you sure you want to restore this discussion thread?`)) return;

    try {
      setLoading(true);
      await adminAPI.restoreDiscussion(discussionId);
      loadDiscussion();
    } catch (err: any) {
      setError(err.message || 'Failed to restore discussion');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !thread) {
    return <div className="admin-loading">Loading discussion...</div>;
  }

  if (error && !thread) {
    return (
      <div>
        <div className="admin-error">{error}</div>
        <button onClick={onBack} className="admin-back-button">Back to Dashboard</button>
      </div>
    );
  }

  if (!thread) return null;

  return (
    <>
      <NavBar />
      <div className="admin-detail-view">
        <div className="admin-detail-header">
          <button onClick={onBack} className="admin-back-button">← Back to Dashboard</button>
          <h2>Discussion: {thread.title}</h2>
        </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-detail-content">
        <div className="admin-detail-section">
          <h3>Thread Information</h3>
          <div className="admin-detail-info">
            <div className="info-row">
              <strong>Title:</strong> <span>{thread.title}</span>
            </div>
            <div className="info-row">
              <strong>Author:</strong> <span>{thread.author}</span>
            </div>
            {thread.authorEmail && (
              <div className="info-row">
                <strong>Author Email:</strong> <span>{thread.authorEmail}</span>
              </div>
            )}
            <div className="info-row">
              <strong>Movie:</strong> <span>{thread.movie} (ID: {thread.movieTmdbId})</span>
            </div>
            <div className="info-row">
              <strong>Status:</strong> <span className={thread.isDeleted ? 'deleted-status' : 'active-status'}>
                {thread.isDeleted ? 'Deleted' : 'Active'}
              </span>
            </div>
            <div className="info-row">
              <strong>Views:</strong> <span>{thread.views}</span>
            </div>
            <div className="info-row">
              <strong>Replies:</strong> <span>{thread.replies.length}</span>
            </div>
            <div className="info-row">
              <strong>Created:</strong> <span>{new Date(thread.createdAt).toLocaleString()}</span>
            </div>
            {thread.tags && thread.tags.length > 0 && (
              <div className="info-row">
                <strong>Tags:</strong> <span>{thread.tags.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="admin-detail-section">
          <h3>Content</h3>
          <div className="admin-discussion-content">
            <p>{thread.content}</p>
          </div>
        </div>

        <div className="admin-detail-section">
          <h3>Replies ({thread.replies.length})</h3>
          {thread.replies.length === 0 ? (
            <p>No replies yet</p>
          ) : (
            <div className="admin-replies-list">
              {thread.replies.map((reply: Reply) => (
                <div key={reply.id} className="admin-reply-item">
                  <div className="reply-header">
                    <strong>{reply.author}</strong>
                    <span className="reply-timestamp">
                      {new Date(reply.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="reply-content">{reply.content}</div>
                  <div className="reply-actions">
                    <button
                      onClick={() => handleDeleteReply(reply.id)}
                      className="admin-action-button delete small"
                    >
                      Delete Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-detail-actions">
          {thread.isDeleted ? (
            <button onClick={handleRestoreThread} className="admin-action-button restore">
              Restore Discussion
            </button>
          ) : (
            <button onClick={handleDeleteThread} className="admin-action-button delete">
              Delete Entire Thread
            </button>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default DiscussionDetailView;

