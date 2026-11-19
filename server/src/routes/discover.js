const { Router } = require('express');
const discover = require('../services/discoverService');
const publicProfile = require('../utils/publicProfile');

const router = Router();

// The logged-in user's own profile (used for the "It's a match!" screen).
router.get('/me', (req, res) => {
  res.json(publicProfile(req.user));
});

// Profiles the user hasn't swiped on yet.
router.get('/feed', async (req, res) => {
  res.json(await discover.getFeed(req.user._id));
});

// Body: { profileId, action: "like" | "pass" } → { matched, match? }
router.post('/swipe', async (req, res) => {
  res.status(201).json(await discover.recordSwipe(req.user._id, req.body));
});

// The user's mutual matches, newest first.
router.get('/matches', async (req, res) => {
  res.json(await discover.getMatches(req.user._id));
});

module.exports = router;
