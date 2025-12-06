import React from 'react';
import { adminAPI } from '../../api/admin';
import type { AdminComment } from '../../api/admin';
import NavBar from '../Component/Navbar';
import './admin.css';

interface CommentDetailViewProps {
  comment: AdminComment;
  onBack: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
}

const CommentDetailView: React.FC<CommentDetailViewProps> = ({ 
  comment, 
  onBack, 
  onDelete, 
  onRestore 
}) => {
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await adminAPI.deleteComment(comment.id);
      alert('Comment deleted successfully');
      if (onDelete) onDelete();
      onBack();
    } catch (err: any) {
      alert(err.message || 'Failed to delete comment');
    }
  };

  const handleRestore = async () => {
    if (!window.confirm('Are you sure you want to restore this comment?')) return;

    try {
      await adminAPI.restoreComment(comment.id);
      alert('Comment restored successfully');
      if (onRestore) onRestore();
      onBack();
    } catch (err: any) {
      alert(err.message || 'Failed to restore comment');
    }
  };

  return (
    <>
      <NavBar />
      <div className="admin-detail-view">
        <div className="admin-detail-header">
          <button onClick={onBack} className="admin-back-button">← Back to Dashboard</button>
          <h2>Comment Details</h2>
        </div>

        <div className="admin-detail-content">
          <div className="admin-detail-section">
            <h3>Comment Information</h3>
            <div className="admin-detail-info">
              <div className="info-row">
                <strong>Comment ID:</strong> <span>{comment.id}</span>
              </div>
              <div className="info-row">
                <strong>User:</strong> <span>{comment.username}</span>
              </div>
              <div className="info-row">
                <strong>Email:</strong> <span>{comment.email}</span>
              </div>
              <div className="info-row">
                <strong>Movie ID:</strong> <span>{comment.movieTmdbId}</span>
              </div>
              <div className="info-row">
                <strong>Status:</strong> <span className={comment.isDeleted ? 'deleted-status' : 'active-status'}>
                  {comment.isDeleted ? 'Deleted' : 'Active'}
                </span>
              </div>
              <div className="info-row">
                <strong>Created:</strong> <span>{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              {comment.deletedAt && (
                <div className="info-row">
                  <strong>Deleted At:</strong> <span>{new Date(comment.deletedAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          <div className="admin-detail-section">
            <h3>Comment Content</h3>
            <div className="admin-discussion-content">
              <p style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{comment.text}</p>
            </div>
          </div>

          <div className="admin-detail-actions">
            {comment.isDeleted ? (
              <button onClick={handleRestore} className="admin-action-button restore">
                Restore Comment
              </button>
            ) : (
              <button onClick={handleDelete} className="admin-action-button delete">
                Delete Comment
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentDetailView;

