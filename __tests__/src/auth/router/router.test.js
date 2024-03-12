'use strict';

const { app } = require('../../../../src/server.js');
const supertest = require('supertest');
const { db, users } = require('../../../../src/schemas/index-models.js');
const mockRequest = supertest(app);

// Define test user data
let testAdmin;
let userData = {
  testUser: { username: 'user', password: 'password' },

};
let accessToken = null;

beforeAll(async () => {
  await db.sync({force: true});
  // Create admin user for delete test
  testAdmin = await users.create({
    username: 'TestAdmin',
    password: 'pass123',
    role: 'admin',
  });
});

afterAll(async () => {
  await db.close();
});

describe('Auth Router', () => {

  it('can create a new user', async () => {

    const response = await mockRequest.post('/signup').send(userData.testUser);
    const userObject = response.body;

    expect(response.status).toBe(201);
    expect(userObject.token).toBeDefined();
    expect(userObject.user.id).toBeDefined();
    expect(userObject.user.username).toEqual(userData.testUser.username);
  });

  it('can signin with basic auth string', async () => {
    let { username, password } = userData.testUser;

    const response = await mockRequest
      .post('/signin')
      .auth(username, password);

    const userObject = response.body;
    expect(response.status).toBe(200);
    expect(userObject.token).toBeDefined();
    expect(userObject.user.id).toBeDefined();
    expect(userObject.user.username).toEqual(username);
  });

  it('GETS users with a valid token and delete permission', async () => {

    const response = await mockRequest
      .get('/users')
      .set('Authorization', `Bearer ${testAdmin.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
    expect(response.body).toEqual(expect.anything());
  });

  it('can access secret Route with valid token', async () => {
    const response = await mockRequest
      .get('/secret')
      .set('Authorization', `Bearer ${testAdmin.token}`);

    expect(response.status).toBe(200);
  });

  it('verfies basic auth fails with known user and wrong password ', async () => {

    const response = await mockRequest
      .post('/signin')
      .auth('admin', 'xyz');
    const { user, token } = response.body;

    expect(response.status).toBe(403);
    expect(response.body.message).toEqual('Invalid Login');
    expect(user).not.toBeDefined();
    expect(token).not.toBeDefined();
  });

  it('verifies basic auth fails with unknown user', async () => {

    const response = await mockRequest.post('/signin')
      .auth('nobody', 'xyz');
    const { user, token } = response.body;

    expect(response.status).toBe(403);
    expect(response.body.message).toEqual('Invalid Login');
    expect(user).not.toBeDefined();
    expect(token).not.toBeDefined();
  });

  it('verifies bearer auth fails with an invalid token', async () => {

    // First, use basic to login to get a token
    const response = await mockRequest.get('/users')
      .set('Authorization', `Bearer foobar`);
    const userList = response.body;

    // Not checking the value of the response, only that we "got in"
    expect(response.status).toBe(403);
    expect(response.body.message).toEqual('Invalid Login');
    expect(userList.length).toBeFalsy();
  });

  it('deny Secret Route access with invalid token', async () => {
    const response = await mockRequest
      .get('/secret')
      .set('Authorization', `bearer accessgranted`);

    expect(response.status).toBe(403);
    expect(response.body.message).toEqual('Invalid Login');
  });
});