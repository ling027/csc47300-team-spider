import React, { useState } from 'react';
import { adminAPI } from '../../api/admin';
import type { AdminComment } from '../../api/admin';
import ConfirmDialog from '../../components/ConfirmDialog';
import Alert from '../../components/Alert';
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
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'delete' | 'restore' | 'default';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'default',
    onConfirm: () => {}
  });
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>({
    isOpen: false,
    message: '',
    type: 'info'
  });

  const handleDelete = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this comment?',
      type: 'delete',
      onConfirm: async () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false });
        try {
          await adminAPI.deleteComment(comment.id);
          setAlert({
            isOpen: true,
            message: 'Comment deleted successfully',
            type: 'success'
          });
          if (onDelete) onDelete();
          setTimeout(() => onBack(), 1000);
        } catch (err: any) {
          setAlert({
            isOpen: true,
            message: err.message || 'Failed to delete comment',
            type: 'error'
          });
        }
      }
    });
  };

  const handleRestore = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Restore',
      message: 'Are you sure you want to restore this comment?',
      type: 'restore',
      onConfirm: async () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false });
        try {
          await adminAPI.restoreComment(comment.id);
          setAlert({
            isOpen: true,
            message: 'Comment restored successfully',
            type: 'success'
          });
          if (onRestore) onRestore();
          setTimeout(() => onBack(), 1000);
        } catch (err: any) {
          setAlert({
            isOpen: true,
            message: err.message || 'Failed to restore comment',
            type: 'error'
          });
        }
      }
    });
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
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        confirmText={confirmDialog.type === 'delete' ? 'Delete' : 'Restore'}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />
      <Alert
        isOpen={alert.isOpen}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ ...alert, isOpen: false })}
      />
    </>
  );
};

export default CommentDetailView;

