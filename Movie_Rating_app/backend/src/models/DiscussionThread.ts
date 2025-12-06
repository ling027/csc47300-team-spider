import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDiscussionReply {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  author: string;
  content: string;
  timestamp: Date;
}

export interface IDiscussionThread extends Document {
  userId: Types.ObjectId;
  title: string;
  movieTitle: string;
  movieTmdbId: number;
  content: string;
  tags: string[];
  replies: IDiscussionReply[];
  views: number;
  lastActivity: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
}

const DiscussionReplySchema = new Schema<IDiscussionReply>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: [1000, 'Reply cannot exceed 1000 characters']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

const DiscussionThreadSchema = new Schema<IDiscussionThread>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Thread title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    movieTitle: {
      type: String,
      required: true,
      trim: true
    },
    movieTmdbId: {
      type: Number,
      required: true,
      index: true
    },
    content: {
      type: String,
      required: [true, 'Thread content is required'],
      trim: true,
      maxlength: [1000, 'Content cannot exceed 1000 characters']
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags: string[]) => tags.length <= 10,
        message: 'Cannot have more than 10 tags'
      }
    },
    replies: {
      type: [DiscussionReplySchema],
      default: []
    },
    views: {
      type: Number,
      default: 0,
      min: [0, 'Views cannot be negative']
    },
    lastActivity: {
      type: Date,
      default: Date.now
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
DiscussionThreadSchema.index({ movieTmdbId: 1, createdAt: -1 });
DiscussionThreadSchema.index({ lastActivity: -1 });

export const DiscussionThread = mongoose.model<IDiscussionThread>('DiscussionThread', DiscussionThreadSchema);


