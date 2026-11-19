const { Schema, model } = require('mongoose');

// A match is stored once per pair. The two ids are always saved in sorted
// order (userA < userB), so "A matched B" and "B matched A" are the same document.
const matchSchema = new Schema(
  {
    userA: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userB: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

matchSchema.index({ userA: 1, userB: 1 }, { unique: true });

matchSchema.statics.pairKey = function pairKey(id1, id2) {
  const [userA, userB] = [String(id1), String(id2)].sort();
  return { userA, userB };
};

module.exports = model('Match', matchSchema);
