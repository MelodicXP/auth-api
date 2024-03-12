'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');


// Esoteric Resources
const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');
//TODO - find out what to do with logger
const logger = require('./auth/middleware/logger.js');
const authRoutes = require('./routes/auth-routes.js');
const v1Routes = require('./routes/v1.js');
const v2Routes = require('./routes/v2.js');

const PORT = process.env.PORT || 3000;

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// assuming you are on port 3001:
// http://localhost:3001/api/v1/food

// Routes
app.use(authRoutes);
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);

// Establish default route
app.get('/', (req, res, next) => {
  const message = 'Default route message';
  res.status(200).send(message);
});

// Catchalls
app.use('*', notFoundHandler);
app.use(errorHandler);

// Start Server
function start() {
  if (!PORT) { throw new Error('Missing Port'); }
  app.listen(PORT, () => console.log(`Server Up on ${PORT}`));
}

module.exports = {
  start,
  app,
};