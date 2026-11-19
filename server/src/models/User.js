const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 18 },
    photo: { type: String, required: true },
    bio: { type: String, default: '' },
    city: { type: String, default: '' },
    college: { type: String, default: '' },
    interests: { type: [String], default: [] },
    // No auth in this app: exactly one seeded user is "logged in".
    isCurrentUser: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model('User', userSchema);
