import mongoose, { Schema } from 'mongoose';

// create a PostSchema with a title field
const GameSchema = new Schema({
  id: { type: String, unique: true },
  name: { type: String },
  coverUrl: { type: String },
  summary: { type: String },
  releaseYear: { type: String },
  avgRating: { type: Number },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

// create PostModel class from schema
const GameModel = mongoose.model('Game', GameSchema);

export default GameModel;
