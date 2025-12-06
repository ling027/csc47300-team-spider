import mongoose, { Schema, Document, Types } from 'mongoose';

export type ActivityType = 'watchlist_add' | 'watchlist_remove' | 'comment' | 'discussion' | 'reply' | 'rating';

export interface IUserActivity extends Document {
  userId: Types.ObjectId;
  activityType: ActivityType;
  movieId: number;
  timestamp: Date;
}

const UserActivitySchema = new Schema<IUserActivity>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    activityType: {
      type: String,
      required: true,
      enum: ['watchlist_add', 'watchlist_remove', 'comment', 'discussion', 'reply', 'rating']
    },
    movieId: {
      type: Number,
      required: true,
      index: true
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: false
  }
);

// Index for faster queries
UserActivitySchema.index({ userId: 1, timestamp: -1 });
UserActivitySchema.index({ movieId: 1, timestamp: -1 });

export const UserActivity = mongoose.model<IUserActivity>('UserActivity', UserActivitySchema);


