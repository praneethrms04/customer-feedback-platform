import mongoose, { Document, Model, Schema } from 'mongoose';

export type FeedbackStatus = 'Pending' | 'Reviewed' | 'Resolved';

export interface IFeedback extends Document {
  name: string;
  email: string;
  category: string;
  rating: number;
  comment: string;
  status: FeedbackStatus;
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      minlength: [2, 'Category must be at least 2 characters long'],
      maxlength: [50, 'Category cannot exceed 50 characters']
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5']
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      trim: true,
      minlength: [5, 'Comment must be at least 5 characters long'],
      maxlength: [2000, 'Comment cannot exceed 2000 characters']
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Reviewed', 'Resolved'],
        message: '{VALUE} is not a supported status'
      },
      default: 'Pending'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

feedbackSchema.index({ status: 1, category: 1, rating: 1, createdAt: -1 });
feedbackSchema.index({ email: 1 });

const Feedback: Model<IFeedback> = mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', feedbackSchema);

export default Feedback;
