const { Schema, model } = require('mongoose');

const ACTIONS = ['like', 'pass'];

const swipeSchema = new Schema(
  {
    swiper: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    target: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, enum: ACTIONS, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// One swipe per (swiper, target) pair. The database itself refuses a second
// swipe, so a profile can never be swiped twice, even under concurrent requests.
swipeSchema.index({ swiper: 1, target: 1 }, { unique: true });

const Swipe = model('Swipe', swipeSchema);
Swipe.ACTIONS = ACTIONS;

module.exports = Swipe;
