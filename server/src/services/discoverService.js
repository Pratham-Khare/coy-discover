const mongoose = require('mongoose');
const User = require('../models/User');
const Swipe = require('../models/Swipe');
const Match = require('../models/Match');
const HttpError = require('../utils/HttpError');
const publicProfile = require('../utils/publicProfile');

const DUPLICATE_KEY = 11000;

/**
 * Profiles the user has not swiped on yet (neither liked nor passed).
 *
 * The order is neutral (oldest profile first). It never looks at who has
 * liked the user, so the position of a card cannot hint that they liked you.
 */
async function getFeed(meId) {
  const swipedIds = await Swipe.distinct('target', { swiper: meId });

  const users = await User.find({ _id: { $nin: [meId, ...swipedIds] } })
    .sort({ createdAt: 1, _id: 1 })
    .lean();

  return users.map(publicProfile);
}

/**
 * Record a like or pass from `meId` on `profileId`.
 *
 * Returns { matched: true, match } only when this like completes a mutual
 * like. Every other case (a pass, or a like the other person hasn't returned)
 * returns exactly { matched: false }, so the response never reveals whether
 * the other person liked you.
 */
async function recordSwipe(meId, { profileId, action } = {}) {
  if (!Swipe.ACTIONS.includes(action)) {
    throw new HttpError(400, 'action must be "like" or "pass"');
  }
  if (typeof profileId !== 'string' || !mongoose.isObjectIdOrHexString(profileId)) {
    throw new HttpError(400, 'profileId must be a valid profile id');
  }
  if (profileId === String(meId)) {
    throw new HttpError(400, 'You cannot swipe on yourself');
  }

  const target = await User.findById(profileId).lean();
  if (!target) {
    throw new HttpError(404, 'Profile not found');
  }

  try {
    await Swipe.create({ swiper: meId, target: target._id, action });
  } catch (err) {
    if (err.code === DUPLICATE_KEY) {
      throw new HttpError(409, 'You have already swiped on this profile');
    }
    throw err;
  }

  if (action === 'pass') {
    return { matched: false };
  }

  const theyLikedMe = await Swipe.exists({ swiper: target._id, target: meId, action: 'like' });
  if (!theyLikedMe) {
    return { matched: false };
  }

  const match = await createMatch(meId, target._id);
  return { matched: true, match: toMatchResponse(match, target) };
}

/** All mutual matches of the user, newest first. */
async function getMatches(meId) {
  const matches = await Match.find({ $or: [{ userA: meId }, { userB: meId }] })
    .sort({ createdAt: -1, _id: -1 })
    .populate(['userA', 'userB'])
    .lean();

  return matches
    .map((match) => {
      const other = String(match.userA?._id) === String(meId) ? match.userB : match.userA;
      return other ? toMatchResponse(match, other) : null; // skip if the other user was deleted
    })
    .filter(Boolean);
}

// Create the match, or return the existing one if it is already there
// (for example, when two requests race). The unique index keeps it to one per pair.
async function createMatch(id1, id2) {
  const pair = Match.pairKey(id1, id2);
  try {
    return await Match.create(pair);
  } catch (err) {
    if (err.code === DUPLICATE_KEY) return Match.findOne(pair);
    throw err;
  }
}

function toMatchResponse(match, otherUser) {
  return {
    id: String(match._id),
    matchedAt: match.createdAt,
    profile: publicProfile(otherUser),
  };
}

module.exports = { getFeed, recordSwipe, getMatches };
