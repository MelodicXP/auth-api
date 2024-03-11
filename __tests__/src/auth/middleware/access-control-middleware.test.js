'use strict';

const { app } = require('../../../../src/server.js');
const { db, users } = require('../../../../src/schemas/index-models.js');
const supertest = require('supertest');
const request = supertest(app);
const base64 = require('base-64');

let testWriter;
let createdFoodItemId;

// Pre-load database with fake users
beforeAll(async () => {
  await db.sync({force: true});
  // Create test user with writer role
  testWriter = await users.create({
    username: 'Testwriter',
    password: 'pass123',
    role: 'writer',
  });
});

afterAll(async () => {
  await db.drop();
});

describe('ACL Integration', () => {
  it('allows create access', async () => {
    // Create item
    const foodItem = {
      name: 'banana',
      calories: 100,
      type: 'fruit',
    };

    // Create food item
    let response = await request
      .post('/api/v2/food')
      .set('Authorization', `Bearer ${testWriter.token}`)
      .send(foodItem); // send food data in request body

    expect(response.status).toEqual(201);
    expect(response.body.name).toEqual(foodItem.name);

    // Save ID of food item for use in later tests
    createdFoodItemId = response.body.id;
  });

  it('allows read access', async () => {
    // Create Bearer auth set('Authorization', `Bearer ${testWriter.token}`) is used to send a header

    // Create Basic Auth Header(username and password only needed to read)
    const credentials = base64.encode('Testwriter:pass123');
    const authHeader = `Basic ${credentials}`;

    // Set Authorization header
    let response = await request.get('/api/v2/food').set('Authorization', authHeader);

    console.log('--------------------------------- from read', testWriter);

    expect(response.status).toEqual(200);
    expect(Array.isArray(response.body)).toBe(true); // Check if response body is an array
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('does NOT allow update access', async () => {
    // set('Authorization', `Bearer ${testWriter.token}`) is used to set and send header
    if (!createdFoodItemId) {
      throw new Error('No food item ID defined. Make sure \'allows create access\' test runs successfully before this test.');
    }

    // Update food item
    const updatedFoodItem = {
      calories: 250, // New calorie count
    };

    let response = await request
      .put(`/api/v2/food/${createdFoodItemId}`)
      .set('Authorization', `Bearer ${testWriter.token}`)
      .send(updatedFoodItem);

    expect(response.status).toEqual(500);
    console.log('this is response from update', response.body);
    expect(response.body.message).toEqual('Access Denied');
  });

  it('does NOT allow delete access', async () => {
    // set('Authorization', `Bearer ${testWriter.token}`) is used to set and send header

    let response = await request
      .delete(`/api/v2/food/${createdFoodItemId}`)
      .set('Authorization', `Bearer ${testWriter.token}`);

    expect(response.status).toEqual(500);
    expect(response.body.message).toEqual('Access Denied');
  });
});