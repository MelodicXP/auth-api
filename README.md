# LAB - Class 08

## Project: Access Control

Authentication Server Phase 3: Role Based Access Control  
Role Based Access Control (RBAC) using an Access Control List (ACL)

### Author: Melo

### Problem Domain

**Authentication System Phase 3:**  

Extend the restrictive capabilities of our routes to our API, implementing a fully functional, authenticated and authorized API Server using the latest coding techniques.

### Links and Resources

- [Pull Request](https://github.com/MelodicXP/auth-api/pulls)
- [GitHub Actions ci/cd](https://github.com/MelodicXP/auth-api/actions)
- Prod [back-end server url](https://auth-api-1n5k.onrender.com)

### Collaborators

### Setup

#### `.env` requirements (where applicable)

DATABASE_URL: postgres://localhost:XXXX/name-of-server

#### How to initialize/run your application (where applicable)

- e.g. `npm start`

#### How to use your library (where applicable)

#### Features / Routes

- Feature One: Deploy as prod branch once all tests pass.

#### Tests

- How do you run tests?
  - jest and supertest

- Any tests of note?
  - 404 on a bad route
  - 404 on a bad method
  - POST to /signup to create a new user.
  - POST to /signin to login as a user (use basic auth).
  - Tests for auth middleware and routes.

- AUTH Routes:
  - POST /signup creates a new user and sends an object with the user and the token to the client.
  - POST /signin with basic authentication headers logs in a user and sends an object with the user and the token to the client.

- V1 (Unauthenticated API) routes:
  - POST /api/v1/:model adds an item to the DB and returns an object with the added item.
  - GET /api/v1/:model returns a list of :model items.
  - GET /api/v1/:model/ID returns a single item by ID.
  - PUT /api/v1/:model/ID returns a single, updated item by ID.
  - DELETE /api/v1/:model/ID returns an empty object. Subsequent GET for the same ID should result in nothing found.  

- V2 (Authenticated API) routes:
  - POST /api/v2/:model with a bearer token that has create permissions adds an item to the DB and returns an object with the added item.
  - GET /api/v2/:model with a bearer token that has read permissions returns a list of :model items.
  - GET /api/v2/:model/ID with a bearer token that has read permissions returns a single item by ID.
  - PUT /api/v2/:model/ID with a bearer token that has update permissions returns a single, updated item by ID.
  - DELETE /api/v2/:model/ID with a bearer token that has delete permissions returns an empty object. Subsequent GET for the same ID should result in nothing found.

#### UML

![Lab-08-UML](./assets/auth-api-UML.png)
![Lab-08-UML-File-Structure](./assets/lab-08-file-structure.png)
