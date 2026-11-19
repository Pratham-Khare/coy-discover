require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const { connectDB } = require('../src/db');
const User = require('../src/models/User');
const Swipe = require('../src/models/Swipe');
const Match = require('../src/models/Match');
const { currentUser, profiles } = require('./profiles');

// Wipes the database and loads the demo data. Re-run it to reset the demo.
async function seedDatabase() {
  await Promise.all([User.deleteMany({}), Swipe.deleteMany({}), Match.deleteMany({})]);

  const me = await User.create({ ...currentUser, isCurrentUser: true });
  const users = await User.insertMany(profiles.map(({ likesMe, ...profile }) => profile));

  const likesOfMe = users
    .filter((user, i) => profiles[i].likesMe)
    .map((user) => ({ swiper: user._id, target: me._id, action: 'like' }));
  await Swipe.insertMany(likesOfMe);

  return { me, users, likesOfMe };
}

if (require.main === module) {
  connectDB()
    .then(seedDatabase)
    .then(({ users, likesOfMe }) => {
      console.log(`Seeded 1 logged-in user, ${users.length} profiles, ${likesOfMe.length} of whom already like you.`);
    })
    .catch((err) => {
      console.error('Seeding failed:', err.message);
      process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
}

module.exports = { seedDatabase };
