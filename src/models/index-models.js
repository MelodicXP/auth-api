'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const clothesSchema = require('./clothes/clothesSchema.js');
const foodSchema = require('./food/foodSchema.js');
const usersSchema = require('./users/usersSchema.js');
const Collection = require('./data-collection.js');

// Connect to database for testing purpose, or connect to database from env
const DATABASE_URL = process.env.NODE_ENV === 'test' 
  ? 'sqlite:memory' 
  : process.env.DATABASE_URL;

// Configure database with dialect options
const DATABASE_CONFIG = process.env.NODE_ENV === 'production' ? {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
} : {};

// Initialize single instance of Sequelize with database configuration
const sequelize = new Sequelize(DATABASE_URL, DATABASE_CONFIG);

// Initialize models
const foodModel = foodSchema(sequelize, DataTypes);
const clothesModel = clothesSchema(sequelize, DataTypes);
const usersModel = usersSchema(sequelize, DataTypes); 

// Create a new Collection class for each model
const food = new Collection(foodModel);
const clothes = new Collection(clothesModel);
const users = new Collection(usersModel);

module.exports = {
  db: sequelize,
  food,
  clothes,
  users,
};
