'use strict';

require('dotenv').config();

// Import to start server
const { start } = require('./src/server.js');

// Import Database
const { db } = require('./src/models/index-models.js');

db.sync()
  .then(() => {
    console.log('Successful Connection!');
    start();
  });
