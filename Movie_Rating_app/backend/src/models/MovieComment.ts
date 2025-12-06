import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMovieComment extends Document {
  userId: Types.ObjectId;
  movieTmdbId: number;
  text: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
}

const MovieCommentSchema = new Schema<IMovieComment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    movieTmdbId: {
      type: Number,
      required: true,
      index: true
    },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
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
MovieCommentSchema.index({ movieTmdbId: 1, createdAt: -1 });
MovieCommentSchema.index({ userId: 1, createdAt: -1 });

export const MovieComment = mongoose.model<IMovieComment>('MovieComment', MovieCommentSchema);


