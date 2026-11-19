const express = require('express');
const cors = require('cors');
const currentUser = require('./middleware/currentUser');
const discoverRoutes = require('./routes/discover');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', currentUser, discoverRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Express 5 forwards errors thrown in async handlers here automatically.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status >= 500 ? 'Something went wrong' : err.message });
});

module.exports = app;
