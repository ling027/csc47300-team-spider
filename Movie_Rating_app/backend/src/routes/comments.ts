import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { MovieComment } from '../models/MovieComment.js';
import { User } from '../models/User.js';
import { UserActivity } from '../models/UserActivity.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get all comments for a movie
router.get('/:movieId/comments', async (req: Request, res: Response) => {
  try {
    const movieTmdbId = parseInt(req.params.movieId);

    if (isNaN(movieTmdbId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid movie ID'
      });
    }

    const comments = await MovieComment.find({ 
      movieTmdbId,
      isDeleted: { $ne: true }
    })
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });

    res.json({
      status: 'success',
      data: {
        comments: comments.map(comment => ({
          id: comment._id,
          userId: comment.userId,
          username: (comment.userId as any)?.username || 'Unknown',
          email: (comment.userId as any)?.email || '',
          text: comment.text,
          createdAt: comment.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get comments'
    });
  }
});

// Add comment to movie (requires authentication)
router.post(
  '/:movieId/comments',
  authMiddleware,
  [
    body('text')
      .trim()
      .notEmpty()
      .withMessage('Comment text is required')
      .isLength({ max: 500 })
      .withMessage('Comment cannot exceed 500 characters')
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const movieTmdbId = parseInt(req.params.movieId);
      const userId = req.userId!;
      const { text } = req.body;

      if (isNaN(movieTmdbId)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid movie ID'
        });
      }

      const comment = new MovieComment({
        userId: new mongoose.Types.ObjectId(userId),
        movieTmdbId,
        text: text.trim()
      });

      await comment.save();

      // Populate user data for response
      await comment.populate('userId', 'username email');

      // Track activity
      try {
        await UserActivity.create({
          userId: new mongoose.Types.ObjectId(userId),
          activityType: 'comment',
          movieId: movieTmdbId
        });
      } catch (activityError) {
        console.error('Failed to track activity:', activityError);
      }

      res.status(201).json({
        status: 'success',
        message: 'Comment added successfully',
        data: {
          comment: {
            id: comment._id,
            userId: comment.userId,
            username: (comment.userId as any)?.username || 'Unknown',
            email: (comment.userId as any)?.email || '',
            text: comment.text,
            createdAt: comment.createdAt
          }
        }
      });
    } catch (error) {
      console.error('Add comment error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to add comment'
      });
    }
  }
);

export default router;


