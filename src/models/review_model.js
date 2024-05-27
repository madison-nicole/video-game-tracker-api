import mongoose, { Schema } from 'mongoose';

export const PlayStatus = {
  IN_PROGRESS: 'IN_PROGRESS',
  PLAYED: 'PLAYED',
  TO_PLAY: 'TO_PLAY',
  NONE: 'NONE',
};

// create a PostSchema with a title field
const ReviewSchema = new Schema({
  userRating: { type: Number },
  status: { type: String, enum: PlayStatus, default: PlayStatus.NONE },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

// create PostModel class from schema
const ReviewModel = mongoose.model('Review', ReviewSchema);

export default ReviewModel;
