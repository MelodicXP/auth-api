'use strict';

require('dotenv').config();

// Import to start server
const { start } = require('./src/server.js');

// Import Database
const { db } = require('./src/schemas/index-models.js');

async function initializeApp() {
  try {
    await db.sync(); // Wait for the database to sync
    console.log('Successful Connection!');
    start(); // Start the server
  } catch (error) {
    console.error('Failed to start the application:', error);
  }
}

// Call function
initializeApp();
