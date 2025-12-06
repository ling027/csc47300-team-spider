import express, { Request, Response } from 'express';
import { User } from '../models/User.js';
import { MovieComment } from '../models/MovieComment.js';
import { DiscussionThread } from '../models/DiscussionThread.js';
import { Watchlist } from '../models/Watchlist.js';
import { UserActivity } from '../models/UserActivity.js';
import { adminMiddleware, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require admin authentication
router.use(adminMiddleware);

// Get dashboard statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments({ isDeleted: { $ne: true } });
    const totalComments = await MovieComment.countDocuments({ isDeleted: { $ne: true } });
    const totalDiscussions = await DiscussionThread.countDocuments({ isDeleted: { $ne: true } });
    const totalWatchlists = await Watchlist.countDocuments({ isDeleted: { $ne: true } });
    const deletedItems = await User.countDocuments({ isDeleted: true }) +
      await MovieComment.countDocuments({ isDeleted: true }) +
      await DiscussionThread.countDocuments({ isDeleted: true }) +
      await Watchlist.countDocuments({ isDeleted: true });

    res.json({
      status: 'success',
      data: {
        stats: {
          totalUsers,
          totalComments,
          totalDiscussions,
          totalWatchlists,
          deletedItems
        }
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get statistics'
    });
  }
});

// Get all users with filtering
router.get('/users', async (req: Request, res: Response) => {
  try {
    const { search, startDate, endDate, includeDeleted, page = '1', limit = '50' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const query: any = {};
    
    if (includeDeleted !== 'true') {
      query.isDeleted = { $ne: true };
    }

    if (search) {
      query.$or = [
        { username: { $regex: search as string, $options: 'i' } },
        { email: { $regex: search as string, $options: 'i' } },
        { fullname: { $regex: search as string, $options: 'i' } }
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate as string);
      if (endDate) query.createdAt.$lte = new Date(endDate as string);
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await User.countDocuments(query);

    res.json({
      status: 'success',
      data: {
        users: users.map(user => ({
          id: user._id,
          username: user.username,
          email: user.email,
          fullname: user.fullname,
          isAdmin: user.isAdmin,
          isDeleted: user.isDeleted,
          deletedAt: user.deletedAt,
          createdAt: user.createdAt
        })),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get users'
    });
  }
});

// Soft delete user
router.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete user'
    });
  }
});

// Restore user
router.post('/users/:id/restore', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { isDeleted: false, deletedAt: null },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      message: 'User restored successfully'
    });
  } catch (error) {
    console.error('Restore user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to restore user'
    });
  }
});

// Get all comments with filtering
router.get('/comments', async (req: Request, res: Response) => {
  try {
    const { search, userId, movieId, startDate, endDate, includeDeleted, page = '1', limit = '50' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const query: any = {};
    
    if (includeDeleted !== 'true') {
      query.isDeleted = { $ne: true };
    }

    if (userId) {
      query.userId = userId;
    }

    if (movieId) {
      query.movieTmdbId = parseInt(movieId as string);
    }

    if (search) {
      query.text = { $regex: search as string, $options: 'i' };
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate as string);
      if (endDate) query.createdAt.$lte = new Date(endDate as string);
    }

    const comments = await MovieComment.find(query)
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await MovieComment.countDocuments(query);

    res.json({
      status: 'success',
      data: {
        comments: comments.map(comment => ({
          id: comment._id,
          userId: comment.userId,
          username: (comment.userId as any)?.username || 'Unknown',
          email: (comment.userId as any)?.email || '',
          movieTmdbId: comment.movieTmdbId,
          text: comment.text,
          isDeleted: comment.isDeleted,
          deletedAt: comment.deletedAt,
          createdAt: comment.createdAt
        })),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
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

// Soft delete comment
router.delete('/comments/:id', async (req: Request, res: Response) => {
  try {
    const commentId = req.params.id;

    const comment = await MovieComment.findByIdAndUpdate(
      commentId,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({
        status: 'error',
        message: 'Comment not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete comment'
    });
  }
});

// Restore comment
router.post('/comments/:id/restore', async (req: Request, res: Response) => {
  try {
    const commentId = req.params.id;

    const comment = await MovieComment.findByIdAndUpdate(
      commentId,
      { isDeleted: false, deletedAt: null },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({
        status: 'error',
        message: 'Comment not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Comment restored successfully'
    });
  } catch (error) {
    console.error('Restore comment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to restore comment'
    });
  }
});

// Get all discussions with filtering
router.get('/discussions', async (req: Request, res: Response) => {
  try {
    const { search, userId, movieId, startDate, endDate, includeDeleted, page = '1', limit = '50' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const query: any = {};
    
    if (includeDeleted !== 'true') {
      query.isDeleted = { $ne: true };
    }

    if (userId) {
      query.userId = userId;
    }

    if (movieId) {
      query.movieTmdbId = parseInt(movieId as string);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { content: { $regex: search as string, $options: 'i' } }
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate as string);
      if (endDate) query.createdAt.$lte = new Date(endDate as string);
    }

    const discussions = await DiscussionThread.find(query)
      .populate('userId', 'username')
      .sort({ lastActivity: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await DiscussionThread.countDocuments(query);

    res.json({
      status: 'success',
      data: {
        discussions: discussions.map(thread => ({
          id: thread._id,
          title: thread.title,
          movie: thread.movieTitle,
          movieTmdbId: thread.movieTmdbId,
          author: (thread.userId as any)?.username || 'Unknown',
          content: thread.content,
          tags: thread.tags,
          replies: thread.replies.length,
          views: thread.views,
          isDeleted: thread.isDeleted,
          deletedAt: thread.deletedAt,
          lastActivity: thread.lastActivity,
          createdAt: thread.createdAt
        })),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Get discussions error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get discussions'
    });
  }
});

// Soft delete discussion
router.delete('/discussions/:id', async (req: Request, res: Response) => {
  try {
    const discussionId = req.params.id;

    const discussion = await DiscussionThread.findByIdAndUpdate(
      discussionId,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!discussion) {
      return res.status(404).json({
        status: 'error',
        message: 'Discussion not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Discussion deleted successfully'
    });
  } catch (error) {
    console.error('Delete discussion error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete discussion'
    });
  }
});

// Restore discussion
router.post('/discussions/:id/restore', async (req: Request, res: Response) => {
  try {
    const discussionId = req.params.id;

    const discussion = await DiscussionThread.findByIdAndUpdate(
      discussionId,
      { isDeleted: false, deletedAt: null },
      { new: true }
    );

    if (!discussion) {
      return res.status(404).json({
        status: 'error',
        message: 'Discussion not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Discussion restored successfully'
    });
  } catch (error) {
    console.error('Restore discussion error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to restore discussion'
    });
  }
});

// Get all watchlists with filtering
router.get('/watchlists', async (req: Request, res: Response) => {
  try {
    const { search, userId, startDate, endDate, includeDeleted, page = '1', limit = '50' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const query: any = {};
    
    if (includeDeleted !== 'true') {
      query.isDeleted = { $ne: true };
    }

    if (userId) {
      query.userId = userId;
    }

    if (search) {
      query.name = { $regex: search as string, $options: 'i' };
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate as string);
      if (endDate) query.createdAt.$lte = new Date(endDate as string);
    }

    const watchlists = await Watchlist.find(query)
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await Watchlist.countDocuments(query);

    res.json({
      status: 'success',
      data: {
        watchlists: watchlists.map(watchlist => ({
          id: watchlist._id,
          userId: watchlist.userId,
          username: (watchlist.userId as any)?.username || 'Unknown',
          email: (watchlist.userId as any)?.email || '',
          name: watchlist.name,
          movies: watchlist.movies,
          movieCount: watchlist.movies.length,
          isDeleted: watchlist.isDeleted,
          deletedAt: watchlist.deletedAt,
          createdAt: watchlist.createdAt,
          updatedAt: watchlist.updatedAt
        })),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
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

// Soft delete watchlist
router.delete('/watchlists/:id', async (req: Request, res: Response) => {
  try {
    const watchlistId = req.params.id;

    const watchlist = await Watchlist.findByIdAndUpdate(
      watchlistId,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

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

// Restore watchlist
router.post('/watchlists/:id/restore', async (req: Request, res: Response) => {
  try {
    const watchlistId = req.params.id;

    const watchlist = await Watchlist.findByIdAndUpdate(
      watchlistId,
      { isDeleted: false, deletedAt: null },
      { new: true }
    );

    if (!watchlist) {
      return res.status(404).json({
        status: 'error',
        message: 'Watchlist not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Watchlist restored successfully'
    });
  } catch (error) {
    console.error('Restore watchlist error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to restore watchlist'
    });
  }
});

// Get activity logs with filtering
router.get('/activity', async (req: Request, res: Response) => {
  try {
    const { userId, movieId, type, startDate, endDate, page = '1', limit = '100' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (movieId) {
      query.movieId = parseInt(movieId as string);
    }

    if (type) {
      query.activityType = type;
    }

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate as string);
      if (endDate) query.timestamp.$lte = new Date(endDate as string);
    }

    const activities = await UserActivity.find(query)
      .populate('userId', 'username')
      .sort({ timestamp: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await UserActivity.countDocuments(query);

    res.json({
      status: 'success',
      data: {
        activities: activities.map(activity => ({
          id: activity._id,
          userId: activity.userId,
          username: (activity.userId as any)?.username || 'Unknown',
          activityType: activity.activityType,
          movieId: activity.movieId,
          timestamp: activity.timestamp
        })),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get activity logs'
    });
  }
});

// Get unified trash view (all soft-deleted items)
router.get('/trash', async (req: Request, res: Response) => {
  try {
    const { type, page = '1', limit = '50' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const trashItems: any[] = [];

    // Get deleted users
    if (!type || type === 'user') {
      const users = await User.find({ isDeleted: true })
        .select('-password')
        .sort({ deletedAt: -1 })
        .limit(limitNum)
        .skip(skip);
      
      users.forEach(user => {
        trashItems.push({
          id: user._id,
          type: 'user',
          title: user.username,
          content: user.email,
          deletedAt: user.deletedAt,
          createdAt: user.createdAt
        });
      });
    }

    // Get deleted comments
    if (!type || type === 'comment') {
      const comments = await MovieComment.find({ isDeleted: true })
        .populate('userId', 'username')
        .sort({ deletedAt: -1 })
        .limit(limitNum)
        .skip(skip);
      
      comments.forEach(comment => {
        trashItems.push({
          id: comment._id,
          type: 'comment',
          title: `Comment by ${(comment.userId as any)?.username || 'Unknown'}`,
          content: comment.text.substring(0, 100),
          movieId: comment.movieTmdbId,
          deletedAt: comment.deletedAt,
          createdAt: comment.createdAt
        });
      });
    }

    // Get deleted discussions
    if (!type || type === 'discussion') {
      const discussions = await DiscussionThread.find({ isDeleted: true })
        .populate('userId', 'username')
        .sort({ deletedAt: -1 })
        .limit(limitNum)
        .skip(skip);
      
      discussions.forEach(discussion => {
        trashItems.push({
          id: discussion._id,
          type: 'discussion',
          title: discussion.title,
          content: discussion.content.substring(0, 100),
          movieId: discussion.movieTmdbId,
          deletedAt: discussion.deletedAt,
          createdAt: discussion.createdAt
        });
      });
    }

    // Get deleted watchlists
    if (!type || type === 'watchlist') {
      const watchlists = await Watchlist.find({ isDeleted: true })
        .populate('userId', 'username')
        .sort({ deletedAt: -1 })
        .limit(limitNum)
        .skip(skip);
      
      watchlists.forEach(watchlist => {
        trashItems.push({
          id: watchlist._id,
          type: 'watchlist',
          title: watchlist.name,
          content: `${watchlist.movies.length} movies`,
          deletedAt: watchlist.deletedAt,
          createdAt: watchlist.createdAt
        });
      });
    }

    // Sort by deletedAt
    trashItems.sort((a, b) => {
      const dateA = a.deletedAt ? new Date(a.deletedAt).getTime() : 0;
      const dateB = b.deletedAt ? new Date(b.deletedAt).getTime() : 0;
      return dateB - dateA;
    });

    res.json({
      status: 'success',
      data: {
        trash: trashItems.slice(0, limitNum),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: trashItems.length,
          pages: Math.ceil(trashItems.length / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Get trash error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get trash items'
    });
  }
});

export default router;

