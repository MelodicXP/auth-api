'use strict';

const { app } = require('../../../../src/server.js');
const { db, users } = require('../../../../src/schemas/index-models.js');
const supertest = require('supertest');
const request = supertest(app);
const base64 = require('base-64');

let createdFoodItemIds = [];
let testUser, testWriter, testEditor, testAdmin;

// Pre-load database with fake users
beforeAll(async () => {
  await db.sync({force: true});

  // Create test users with different roles
  testUser = await users.create({
    username: 'TestUser',
    password: 'pass123',
    role: 'user',
  });

  testWriter = await users.create({
    username: 'TestWriter',
    password: 'pass123',
    role: 'writer',
  });

  testEditor = await users.create({
    username: 'TestEditor',
    password: 'pass123',
    role: 'editor',
  });

  testAdmin = await users.create({
    username: 'TestAdmin',
    password: 'pass123',
    role: 'admin',
  });
});

afterAll(async () => {
  await db.drop();
});

describe('V1 UnAuthenticated API routes All roles have CRUD capablities', () => {

  // use login credential established for each user (to be used for header info when running tests)
  const users = [
    { role: 'user', username: 'TestUser', password: 'pass123' },
    { role: 'writer', username: 'TestWriter', password: 'pass123' },
    { role: 'editor', username: 'TestEditor', password: 'pass123' },
    { role: 'admin', username: 'TestAdmin', password: 'pass123' },
  ];

  it('verfies User can CREATE', async () => {
    // Food Item to be created
    const foodItem = {
      name: 'banana',
      calories: 100,
      type: 'fruit',
    };

    // Create food item with authorized user
    let response = await request
      .post('/api/v1/food')
      .set('Authorization', `Bearer ${testUser.token}`)
      .send(foodItem); // send food data in request body

    expect(response.status).toEqual(201);
    expect(response.body.name).toEqual(foodItem.name);

    // Save ID of food item for use in later tests
    createdFoodItemIds.push (response.body.id);
  });

  it('verfies Writer can CREATE', async () => {
    // Food Item to be created
    const foodItem = {
      name: 'banana',
      calories: 100,
      type: 'fruit',
    };

    // Create food item with authorized user
    let response = await request
      .post('/api/v1/food')
      .set('Authorization', `Bearer ${testWriter.token}`)
      .send(foodItem); // send food data in request body

    expect(response.status).toEqual(201);
    expect(response.body.name).toEqual(foodItem.name);

    // Save ID of food item for use in later tests
    createdFoodItemIds.push (response.body.id);
  });

  it('verfies Editor can CREATE', async () => {
    // Food Item to be created
    const foodItem = {
      name: 'banana',
      calories: 100,
      type: 'fruit',
    };

    // Create food item with authorized user
    let response = await request
      .post('/api/v1/food')
      .set('Authorization', `Bearer ${testEditor.token}`)
      .send(foodItem); // send food data in request body

    expect(response.status).toEqual(201);
    expect(response.body.name).toEqual(foodItem.name);

    // Save ID of food item for use in later tests
    createdFoodItemIds.push (response.body.id);
  });

  it('verfies Admin can CREATE', async () => {
    // Food Item to be created
    const foodItem = {
      name: 'banana',
      calories: 100,
      type: 'fruit',
    };

    // Create food item with authorized user
    let response = await request
      .post('/api/v1/food')
      .set('Authorization', `Bearer ${testAdmin.token}`)
      .send(foodItem); // send food data in request body

    expect(response.status).toEqual(201);
    expect(response.body.name).toEqual(foodItem.name);

    // Save ID of food item for use in later tests
    createdFoodItemIds.push (response.body.id);
  });

  it('verifies ALL Users can READ', async () => {
    for (const user of users) {
      // Create Basic Auth Header(username and password only needed to read)
      const credentials = base64.encode(`${user.username}:${user.password}`);
      const authHeader = `Basic ${credentials}`;

      // Set Authorization header
      let response = await request
        .get('/api/v1/food')
        .set('Authorization', authHeader);

      console.log('--------------------------------- from read', user);

      expect(response.status).toEqual(200);
      expect(Array.isArray(response.body)).toBe(true); // Check if response body is an array
      expect(response.body.length).toBeGreaterThan(0);
    }
  });

  it('verifies ALL Users can READ one item', async () => {
    for (const user of users) {
      // Create Basic Auth Header(username and password only needed to read)
      const credentials = base64.encode(`${user.username}:${user.password}`);
      const authHeader = `Basic ${credentials}`;

      // Set Authorization header
      let response = await request
        .get(`/api/v1/food/${createdFoodItemIds[3]}`)
        .set('Authorization', authHeader);

      console.log('--------------------------------- from read', user);

      expect(response.status).toEqual(200);
      expect(Array.isArray(response.body)).toBe(false); // Check if response body is an array
      expect(response.body.name).toEqual('banana');
    }
  });

  it('verifies User can UPDATE' , async () => {
    // Food Item to be updated
    const foodItem = {
      name: 'banana',
      calories: 250,
      type: 'fruit',
    };

    let response = await request
      .put(`/api/v1/food/${createdFoodItemIds[0]}`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send(foodItem); // send food data in request body

    expect(response.status).toEqual(200);
    expect(response.body.calories).toEqual(250);
  });

  it('verifies Writer can UPDATE' , async () => {
    // Food Item to be updated
    const foodItem = {
      name: 'banana',
      calories: 250,
      type: 'fruit',
    };

    let response = await request
      .put(`/api/v1/food/${createdFoodItemIds[1]}`)
      .set('Authorization', `Bearer ${testWriter.token}`)
      .send(foodItem); // send food data in request body

    expect(response.status).toEqual(200);
    expect(response.body.calories).toEqual(250);
  });

  it('verifies Editor can UPDATE' , async () => {
    // Food Item to be updated
    const foodItem = {
      name: 'banana',
      calories: 250,
      type: 'fruit',
    };

    let response = await request
      .put(`/api/v1/food/${createdFoodItemIds[2]}`)
      .set('Authorization', `Bearer ${testEditor.token}`)
      .send(foodItem); // send food data in request body

    expect(response.status).toEqual(200);
    expect(response.body.calories).toEqual(250);
  });

  it('verifies Admin can UPDATE' , async () => {
    // Food Item to be updated
    const foodItem = {
      name: 'banana',
      calories: 300,
      type: 'fruit',
    };

    let response = await request
      .put(`/api/v1/food/${createdFoodItemIds[3]}`)
      .set('Authorization', `Bearer ${testAdmin.token}`)
      .send(foodItem); // send food data in request body

    expect(response.status).toEqual(200);
    expect(response.body.calories).toEqual(300);
  });

  it('verifies ALL user roles can DELETE', async () => {
    // set('Authorization', `Bearer ${testWriter.token}`) is used to set and send header
    for (const user of users) {

      // Reverse IDs array to start deleting from last created item
      const idsToDelete = [...createdFoodItemIds].reverse();
      for (const id of idsToDelete) {
        let response = await request
          .delete(`/api/v1/food/${id}`)
          .set('Authorization', `Bearer ${user.token}`);

        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual(`Record ${id} deleted`);
      }
    }
  });
});