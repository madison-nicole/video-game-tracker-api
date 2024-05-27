import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// create a User schema with email and password fields
const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  username: { type: String, unique: true, lowercase: true },
  password: { type: String },
  games: { type: Schema.Types.Mixed, default: {} },
  bio: { type: String, default: '' },
  website: { type: String, default: '' },
  avatarUrl: { type: String, lowercase: true, default: '' },
  following: { type: Number, default: 0 },
  followers: { type: Number, default: 0 },
  socials: { type: Schema.Types.Mixed, default: {} },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
  methods: {
    async comparePassword(candidatePassword) {
      const comparison = await bcrypt.compare(candidatePassword, this.password);
      return comparison;
    },
  },
});

// saving salt + hash for password encryption
// On Save Hook, encrypt password
// Before saving a model, run this function
//  note use of named function rather than arrow notation
//  arrow notation is lexically scoped and prevents binding scope, which mongoose relies on
UserSchema.pre('save', async function beforeUserSave(next) {
  // get access to the user model
  const user = this;

  if (!user.isModified('password')) return next();

  try {
    // salt, hash, then set password to hash
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    return next();
  } catch (error) {
    return next(error);
  }
});

// comparing salt + hash
// note use of named function rather than arrow notation, required here
// UserSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
//   const comparison = await bcrypt.compare(candidatePassword, this.password);
//   return comparison;
// };

// create PostModel class from schema
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
