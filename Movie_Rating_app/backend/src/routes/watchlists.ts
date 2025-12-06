import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { Watchlist, IWatchlistMovie } from '../models/Watchlist.js';
import { UserActivity } from '../models/UserActivity.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all watchlists for authenticated user
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const watchlists = await Watchlist.find({ 
      userId,
      isDeleted: { $ne: true }
    })
      .sort({ createdAt: -1 });

    res.json({
      status: 'success',
      data: {
        watchlists: watchlists.map(w => ({
          id: w._id,
          name: w.name,
          movies: w.movies,
          movieCount: w.movies.length,
          createdAt: w.createdAt,
          updatedAt: w.updatedAt
        }))
      }
    });
  } catch (error) {
    console.error('Get watchlists error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get watchlists'
    });
  }
});

// Get specific watchlist
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const watchlistId = req.params.id;
    const userId = req.userId!;

    const watchlist = await Watchlist.findOne({
      _id: watchlistId,
      userId
    });

    if (!watchlist) {
      return res.status(404).json({
        status: 'error',
        message: 'Watchlist not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        watchlist: {
          id: watchlist._id,
          name: watchlist.name,
          movies: watchlist.movies,
          createdAt: watchlist.createdAt,
          updatedAt: watchlist.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get watchlist'
    });
  }
});

// Create new watchlist
router.post(
  '/',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Watchlist name is required')
      .isLength({ max: 100 })
      .withMessage('Watchlist name cannot exceed 100 characters')
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

      const userId = req.userId!;
      const { name } = req.body;

      const watchlist = new Watchlist({
        userId,
        name: name.trim(),
        movies: []
      });

      await watchlist.save();

      res.status(201).json({
        status: 'success',
        message: 'Watchlist created successfully',
        data: {
          watchlist: {
            id: watchlist._id,
            name: watchlist.name,
            movies: watchlist.movies,
            createdAt: watchlist.createdAt,
            updatedAt: watchlist.updatedAt
          }
        }
      });
    } catch (error) {
      console.error('Create watchlist error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to create watchlist'
      });
    }
  }
);

// Update watchlist name
router.put(
  '/:id',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Watchlist name is required')
      .isLength({ max: 100 })
      .withMessage('Watchlist name cannot exceed 100 characters')
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

      const watchlistId = req.params.id;
      const userId = req.userId!;
      const { name } = req.body;

      const watchlist = await Watchlist.findOneAndUpdate(
        { _id: watchlistId, userId },
        { name: name.trim() },
        { new: true, runValidators: true }
      );

      if (!watchlist) {
        return res.status(404).json({
          status: 'error',
          message: 'Watchlist not found'
        });
      }

      res.json({
        status: 'success',
        message: 'Watchlist updated successfully',
        data: {
          watchlist: {
            id: watchlist._id,
            name: watchlist.name,
            movies: watchlist.movies,
            createdAt: watchlist.createdAt,
            updatedAt: watchlist.updatedAt
          }
        }
      });
    } catch (error) {
      console.error('Update watchlist error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update watchlist'
      });
    }
  }
);

// Delete watchlist
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const watchlistId = req.params.id;
    const userId = req.userId!;

    const watchlist = await Watchlist.findOneAndDelete({
      _id: watchlistId,
      userId
    });

    if (!watchlist) {
      return res.status(404).json({
        status: 'error',
        message: 'Watchlist not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Watchlist deleted successfully'
    });
  } catch (error) {
    console.error('Delete watchlist error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete watchlist'
    });
  }
});

// Add movie to watchlist
router.post(
  '/:id/movies',
  [
    body('tmdbId').isInt().withMessage('TMDB ID must be a number'),
    body('title').trim().notEmpty().withMessage('Movie title is required'),
    body('year').isInt({ min: 1900, max: 2100 }).withMessage('Year must be a valid year'),
    body('runtime').isInt({ min: 0 }).withMessage('Runtime must be a positive number'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('review').optional().trim().isLength({ max: 500 }).withMessage('Review cannot exceed 500 characters'),
    body('poster').optional().trim()
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

      const watchlistId = req.params.id;
      const userId = req.userId!;
      const { tmdbId, title, year, runtime, rating, review, poster } = req.body;

      const watchlist = await Watchlist.findOne({
        _id: watchlistId,
        userId,
        isDeleted: { $ne: true }
      });

      if (!watchlist) {
        return res.status(404).json({
          status: 'error',
          message: 'Watchlist not found'
        });
      }

      // Check if movie already exists in watchlist
      const movieExists = watchlist.movies.some(m => m.tmdbId === tmdbId);
      if (movieExists) {
        return res.status(400).json({
          status: 'error',
          message: 'Movie already exists in this watchlist'
        });
      }

      // Add movie to watchlist
      const newMovie: IWatchlistMovie = {
        tmdbId,
        title: title.trim(),
        year,
        runtime,
        rating,
        review: review?.trim() || '',
        poster: poster?.trim() || ''
      };

      watchlist.movies.push(newMovie);
      await watchlist.save();

      // Track activity
      try {
        await UserActivity.create({
          userId: new mongoose.Types.ObjectId(userId),
          activityType: 'watchlist_add',
          movieId: tmdbId
        });
      } catch (activityError) {
        console.error('Failed to track activity:', activityError);
        // Don't fail the request if activity tracking fails
      }

      res.status(201).json({
        status: 'success',
        message: 'Movie added to watchlist successfully',
        data: {
          movie: newMovie
        }
      });
    } catch (error) {
      console.error('Add movie error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to add movie to watchlist'
      });
    }
  }
);

// Remove movie from watchlist
router.delete('/:id/movies/:movieId', async (req: AuthRequest, res: Response) => {
  try {
    const watchlistId = req.params.id;
    const movieTmdbId = parseInt(req.params.movieId);
    const userId = req.userId!;

    if (isNaN(movieTmdbId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid movie ID'
      });
    }

    const watchlist = await Watchlist.findOne({
      _id: watchlistId,
      userId
    });

    if (!watchlist) {
      return res.status(404).json({
        status: 'error',
        message: 'Watchlist not found'
      });
    }

    const initialLength = watchlist.movies.length;
    watchlist.movies = watchlist.movies.filter(m => m.tmdbId !== movieTmdbId);

    if (watchlist.movies.length === initialLength) {
      return res.status(404).json({
        status: 'error',
        message: 'Movie not found in watchlist'
      });
    }

    await watchlist.save();

    // Track activity
    try {
      await UserActivity.create({
        userId: new mongoose.Types.ObjectId(userId),
        activityType: 'watchlist_remove',
        movieId: movieTmdbId
      });
    } catch (activityError) {
      console.error('Failed to track activity:', activityError);
      // Don't fail the request if activity tracking fails
    }

    res.json({
      status: 'success',
      message: 'Movie removed from watchlist successfully'
    });
  } catch (error) {
    console.error('Remove movie error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to remove movie from watchlist'
    });
  }
});

export default router;


