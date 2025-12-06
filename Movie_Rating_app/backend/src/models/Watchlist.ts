import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IWatchlistMovie {
  tmdbId: number;
  title: string;
  year: number;
  runtime: number;
  rating: number; // 1-5 stars
  review?: string;
  poster: string;
}

export interface IWatchlist extends Document {
  userId: Types.ObjectId;
  name: string;
  movies: IWatchlistMovie[];
  createdAt: Date;
  updatedAt: Date;
}

const WatchlistMovieSchema = new Schema<IWatchlistMovie>({
  tmdbId: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true
  },
  runtime: {
    type: Number,
    required: true,
    min: [0, 'Runtime cannot be negative']
  },
  rating: {
    type: Number,
    required: true,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  review: {
    type: String,
    trim: true,
    maxlength: [500, 'Review cannot exceed 500 characters']
  },
  poster: {
    type: String,
    trim: true
  }
}, { _id: false });

const WatchlistSchema = new Schema<IWatchlist>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Watchlist name is required'],
      trim: true,
      maxlength: [100, 'Watchlist name cannot exceed 100 characters']
    },
    movies: {
      type: [WatchlistMovieSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
WatchlistSchema.index({ userId: 1, name: 1 });

export const Watchlist = mongoose.model<IWatchlist>('Watchlist', WatchlistSchema);


