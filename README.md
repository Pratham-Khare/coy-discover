# Coy: Discover tab

A swipe-based **Discover** tab, built as a standalone MERN app for the Coy SDE Intern assignment.
The app has a bottom tab bar with a blank **Home** tab (a placeholder for Coy's existing app) and a **Discover** tab, where you swipe through profiles, get matched and see your matches.

**Stack:** MongoDB · Express · React · Node.js (plain JavaScript)

| Part | Libraries |
|---|---|
| Frontend | React 19, Vite, react-router-dom, framer-motion (drag gestures and card animations) |
| Backend | Express 5, Mongoose, cors, dotenv, nodemon (dev) |
| Tests | Jest, Supertest, mongodb-memory-server (an in-memory MongoDB, nothing to install) |

---

## Features

- **Tab bar** with Home (blank) and Discover. Inside Discover, a Swipe / Matches toggle.
- **One card at a time** with photo, name, age, college · city, bio and interests. The next card peeks out behind it.
- **Swipe right to like, left to pass.** Drag on mobile, or use the ✕ / ♥ buttons on desktop. The card tilts as you drag and shows a LIKE / NOPE stamp. It flies off past a threshold, otherwise it springs back.
- **A swiped profile never appears again**, even after a reload.
- **An empty state** when you have seen everyone.
- **"It's a match!" screen** the moment a like is mutual.
- **Matches list** of all mutual matches, newest first.
- **Persistence:** swipes and matches are stored in MongoDB.
- **30 seeded profiles**, 7 of whom have already liked you, so you will get matches during a demo.

## Getting started

**Requirements:** Node.js 20.19+ (or 22.12+) and a MongoDB database. Use a local MongoDB, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.

```bash
# 1. Install dependencies (root, server and client)
npm run install:all

# 2. Configure the database (the default is a local MongoDB on port 27017)
cp server/.env.example server/.env    # then edit MONGO_URI if needed

# 3. Load the demo data (re-run any time to reset the demo)
npm run seed

# 4. Start the API (port 4000) and the React app (port 5173) together
npm run dev
```

Open **http://localhost:5173**, then go to the **Discover** tab. Use your browser's device toolbar for the mobile drag experience.

**Demo tip:** these seeded profiles have already liked you, so liking them creates a match: Ananya, Meera, Tara, Rohan, Pooja, Kavya and Aryan.

### Running the tests

```bash
npm test
```

The tests start a throwaway in-memory MongoDB (downloaded on the first run), so no database setup is needed.

---

## API

All endpoints are under `/api`. There is no login: every request acts as the single seeded "logged-in" user.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/feed` | Profiles the user has **not** swiped on yet |
| `POST` | `/api/swipe` | Record a like or pass, and say whether it created a match |
| `GET` | `/api/matches` | The user's mutual matches, newest first |
| `GET` | `/api/me` | The logged-in user's own profile (used for the match screen) |

**`POST /api/swipe`**

```jsonc
// request
{ "profileId": "6650c1...", "action": "like" }   // action: "like" | "pass"

// 201: this like completed a mutual like
{ "matched": true, "match": { "id": "...", "matchedAt": "2026-11-19T10:00:00.000Z", "profile": { ... } } }

// 201: any other case (a pass, or a like that hasn't been returned)
{ "matched": false }
```

| Status | When |
|---|---|
| `400` | `action` is not `like`/`pass`, `profileId` is missing or invalid, or you swipe on yourself |
| `404` | the profile doesn't exist |
| `409` | you've already swiped on this profile |

A profile object always has exactly these fields: `id, name, age, photo, bio, city, college, interests`.

## Privacy: never reveal a like unless it is mutual

This is Coy's core promise, so the backend enforces it in several places:

1. **Profiles are whitelisted.** `publicProfile()` (`server/src/utils/publicProfile.js`) is the only way a user leaves the server. It never includes swipe or "liked you" data, and a new field on the model isn't exposed unless someone adds it there on purpose.
2. **The feed order is neutral.** It is sorted by creation time and never looks at incoming likes. Putting likers first would quietly reveal them.
3. **Every non-match looks the same.** A pass, a pass on someone who liked you, and a one-sided like all return exactly `{ "matched": false }`.
4. **No probing.** You can swipe on a profile only once (enforced by a unique database index). You can't pass and then like to "test" whether someone liked you.
5. **No endpoint lists incoming likes.** The only like information that ever leaves the server is a mutual match.

Each rule has a test in `server/tests/discover.test.js`.

## Data model

| Collection | Fields | Notes |
|---|---|---|
| `users` | name, age, photo, bio, city, college, interests, isCurrentUser | Exactly one user has `isCurrentUser: true` |
| `swipes` | swiper, target, action (`like`/`pass`), createdAt | Unique on `(swiper, target)`, so a profile can't be swiped twice |
| `matches` | userA, userB, createdAt | Ids stored in sorted order, unique on `(userA, userB)`, so one match per pair even under races |

## Project structure

```
coy-discover/
├── server/
│   ├── src/
│   │   ├── app.js                    # Express app (routes and error handling)
│   │   ├── server.js                 # connects to MongoDB and starts listening
│   │   ├── models/                   # User, Swipe, Match
│   │   ├── services/discoverService.js  # feed / swipe / matches logic
│   │   ├── routes/discover.js        # thin HTTP layer
│   │   ├── middleware/currentUser.js # the "logged-in" user
│   │   └── utils/                    # publicProfile whitelist, HttpError
│   ├── seed/                         # demo profiles and seed script
│   └── tests/discover.test.js
└── client/
    └── src/
        ├── App.jsx                   # routes and tab bar
        ├── api.js                    # fetch wrappers
        ├── pages/                    # Home, DiscoverLayout, Swipe, Matches
        └── components/               # SwipeCard, MatchModal, EmptyState, TabBar, Icons
```

---

## Part A: Two core features for Coy

<!-- Write this after exploring https://app.getcoy.com (phone OTP login, adding a crush,
     email verification, the invite link and the extra-slots screen). -->

### Feature 1: _name_

**What it is:**

**Why Coy needs it:**

### Feature 2: _name_

**What it is:**

**Why Coy needs it:**
