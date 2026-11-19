const User = require('../models/User');
const HttpError = require('../utils/HttpError');

// There is no login in this app: every request acts as the single seeded user
// with isCurrentUser: true. In a real app this would read the session or token.
async function currentUser(req, res, next) {
  const me = await User.findOne({ isCurrentUser: true }).lean();
  if (!me) {
    throw new HttpError(500, 'No logged-in user found. Run "npm run seed" first.');
  }
  req.user = me;
  next();
}

module.exports = currentUser;
