import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';

export interface AuthRequest extends Request {
  user?: IUser;
  userId?: string;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required. Please provide a token.'
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const decoded = jwt.verify(token, jwtSecret) as { userId: string };
    const user = await User.findOne({ 
      _id: decoded.userId,
      isDeleted: { $ne: true }
    });

    if (!user) {
      res.status(401).json({
        status: 'error',
        message: 'User not found. Token is invalid.'
      });
      return;
    }

    req.user = user;
    req.userId = user._id.toString();
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid token. Please login again.'
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        status: 'error',
        message: 'Token expired. Please login again.'
      });
      return;
    }

    res.status(500).json({
      status: 'error',
      message: 'Authentication error'
    });
  }
};

export const adminMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // First check authentication
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required. Please provide a token.'
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const decoded = jwt.verify(token, jwtSecret) as { userId: string };
    const user = await User.findOne({ 
      _id: decoded.userId,
      isDeleted: { $ne: true }
    });

    if (!user) {
      res.status(401).json({
        status: 'error',
        message: 'User not found. Token is invalid.'
      });
      return;
    }

    // Check if user is admin
    if (!user.isAdmin) {
      res.status(403).json({
        status: 'error',
        message: 'Access denied. Admin privileges required.'
      });
      return;
    }

    req.user = user;
    req.userId = user._id.toString();
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid token. Please login again.'
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        status: 'error',
        message: 'Token expired. Please login again.'
      });
      return;
    }

    res.status(500).json({
      status: 'error',
      message: 'Admin authentication error'
    });
  }
};


