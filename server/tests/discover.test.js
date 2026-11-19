const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Swipe = require('../src/models/Swipe');
const Match = require('../src/models/Match');
const discover = require('../src/services/discoverService');
const { seedDatabase } = require('../seed/seed');

const PUBLIC_KEYS = ['age', 'bio', 'city', 'college', 'id', 'interests', 'name', 'photo'];

let mongo;
let me;
let liker; // has already liked me
let liker2; // has already liked me
let stranger; // has not liked me
let stranger2; // has not liked me

const makeUser = (name, extra = {}) => ({
  name,
  age: 22,
  photo: `https://example.com/${name}.jpg`,
  bio: `Hi, I am ${name}`,
  city: 'Bengaluru',
  college: 'Some College',
  interests: ['Music'],
  ...extra,
});

const swipe = (profileId, action) => request(app).post('/api/swipe').send({ profileId: String(profileId), action });
const ids = (profiles) => profiles.map((p) => p.id);
const idsOf = (users) => users.map((u) => String(u._id));

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  // The MongoDB driver loads Node's `os` module with a dynamic import(), which
  // Jest's sandbox doesn't support. Passing `os` directly avoids that.
  await mongoose.connect(mongo.getUri(), { runtimeAdapters: { os: require('os') } });
  await Promise.all([User.init(), Swipe.init(), Match.init()]); // build unique indexes
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

beforeEach(async () => {
  await Promise.all([User.deleteMany({}), Swipe.deleteMany({}), Match.deleteMany({})]);

  me = await User.create(makeUser('Me', { isCurrentUser: true }));
  [liker, liker2, stranger, stranger2] = await User.create([
    makeUser('Liker'),
    makeUser('Liker2'),
    makeUser('Stranger'),
    makeUser('Stranger2'),
  ]);
  await Swipe.create([
    { swiper: liker._id, target: me._id, action: 'like' },
    { swiper: liker2._id, target: me._id, action: 'like' },
  ]);
});

describe('GET /api/feed', () => {
  it('returns every other profile, never the logged-in user', async () => {
    const res = await request(app).get('/api/feed').expect(200);

    expect(ids(res.body).sort()).toEqual(idsOf([liker, liker2, stranger, stranger2]).sort());
    expect(ids(res.body)).not.toContain(String(me._id));
  });

  it('hides profiles I have already liked or passed', async () => {
    await swipe(stranger._id, 'like').expect(201);
    await swipe(liker._id, 'pass').expect(201);

    const res = await request(app).get('/api/feed').expect(200);

    expect(ids(res.body).sort()).toEqual(idsOf([liker2, stranger2]).sort());
  });

  it('only exposes public fields, and a liker looks exactly like anyone else', async () => {
    const res = await request(app).get('/api/feed').expect(200);

    for (const profile of res.body) {
      expect(Object.keys(profile).sort()).toEqual(PUBLIC_KEYS);
    }
  });
});

describe('POST /api/swipe', () => {
  it('creates a match when I like someone who already liked me', async () => {
    const res = await swipe(liker._id, 'like').expect(201);

    expect(res.body.matched).toBe(true);
    expect(res.body.match.profile.id).toBe(String(liker._id));
    expect(Object.keys(res.body.match.profile).sort()).toEqual(PUBLIC_KEYS);
    expect(await Match.countDocuments()).toBe(1);
  });

  it('is not a match when I like someone who has not liked me', async () => {
    const res = await swipe(stranger._id, 'like').expect(201);

    expect(res.body).toEqual({ matched: false });
    expect(await Match.countDocuments()).toBe(0);
  });

  it('never reveals a like: every non-match returns the identical body', async () => {
    const passOnLiker = await swipe(liker._id, 'pass').expect(201);
    const passOnStranger = await swipe(stranger._id, 'pass').expect(201);
    const likeOnStranger = await swipe(stranger2._id, 'like').expect(201);

    expect(passOnLiker.body).toEqual({ matched: false });
    expect(passOnStranger.body).toEqual(passOnLiker.body);
    expect(likeOnStranger.body).toEqual(passOnLiker.body);
  });

  it('rejects a second swipe on the same profile, so it never comes back', async () => {
    await swipe(stranger._id, 'like').expect(201);
    await swipe(stranger._id, 'like').expect(409);

    const feed = await request(app).get('/api/feed').expect(200);
    expect(ids(feed.body)).not.toContain(String(stranger._id));
    expect(await Swipe.countDocuments({ swiper: me._id })).toBe(1);
  });

  it('cannot turn a pass into a like later (no probing for likes)', async () => {
    await swipe(liker._id, 'pass').expect(201);
    await swipe(liker._id, 'like').expect(409);

    expect(await Match.countDocuments()).toBe(0);
  });

  it.each([
    ['an unknown action', () => ({ profileId: String(stranger._id), action: 'superlike' }), 400],
    ['a missing action', () => ({ profileId: String(stranger._id) }), 400],
    ['a malformed id', () => ({ profileId: 'not-an-id', action: 'like' }), 400],
    ['a missing id', () => ({ action: 'like' }), 400],
    ['a non-string id', () => ({ profileId: 123, action: 'like' }), 400],
    ['my own id', () => ({ profileId: String(me._id), action: 'like' }), 400],
    ['an id that does not exist', () => ({ profileId: String(new mongoose.Types.ObjectId()), action: 'like' }), 404],
  ])('rejects %s', async (_label, body, status) => {
    const res = await request(app).post('/api/swipe').send(body()).expect(status);

    expect(res.body.error).toEqual(expect.any(String));
    expect(await Swipe.countDocuments({ swiper: me._id })).toBe(0);
  });
});

describe('GET /api/matches', () => {
  it('lists only mutual likes, newest first', async () => {
    await swipe(liker._id, 'like').expect(201);
    await swipe(stranger._id, 'like').expect(201); // one-sided, not a match
    await swipe(liker2._id, 'like').expect(201);

    const res = await request(app).get('/api/matches').expect(200);

    expect(res.body.map((m) => m.profile.id)).toEqual([String(liker2._id), String(liker._id)]);
    for (const match of res.body) {
      expect(match).toEqual({ id: expect.any(String), matchedAt: expect.any(String), profile: expect.any(Object) });
      expect(Object.keys(match.profile).sort()).toEqual(PUBLIC_KEYS);
    }
  });

  it('is empty when nobody has been liked back', async () => {
    const res = await request(app).get('/api/matches').expect(200);

    expect(res.body).toEqual([]);
  });
});

describe('matching logic', () => {
  it('creates the match whichever side likes second', async () => {
    // I like a stranger first: no match yet.
    expect(await discover.recordSwipe(me._id, { profileId: String(stranger._id), action: 'like' })).toEqual({
      matched: false,
    });

    // Later they like me back: now it is a match, for both of us.
    const result = await discover.recordSwipe(stranger._id, { profileId: String(me._id), action: 'like' });

    expect(result.matched).toBe(true);
    expect(ids((await discover.getMatches(me._id)).map((m) => m.profile))).toEqual([String(stranger._id)]);
    expect(ids((await discover.getMatches(stranger._id)).map((m) => m.profile))).toEqual([String(me._id)]);
  });
});

describe('seed data', () => {
  it('has at least 30 profiles, some of whom already like the user', async () => {
    const { me: seededMe, users, likesOfMe } = await seedDatabase();

    expect(users.length).toBeGreaterThanOrEqual(30);
    expect(likesOfMe.length).toBeGreaterThan(0);

    const feed = await request(app).get('/api/feed').expect(200);
    expect(feed.body).toHaveLength(users.length);

    const someoneWhoLikesMe = likesOfMe[0].swiper;
    const res = await swipe(someoneWhoLikesMe, 'like').expect(201);
    expect(res.body.matched).toBe(true);
    expect(res.body.match.profile.id).not.toBe(String(seededMe._id));
  });
});
