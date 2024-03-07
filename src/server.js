'use strict';

const express = require('express');

const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');
const logger = require('./auth/middleware/logger.js');

const v1Routes = require('./routes/v1.js');

const app = express();

app.use(express.json());

app.use(logger);

// assuming you are on port 3001:
// http://localhost:3001/api/v1/food
app.use('/api/v1', v1Routes);

app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
  server: app,
  start: port => {
    if (!port) { throw new Error('Missing Port'); }
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};


// 'use strict';

// // 3rd Party Resources
// const express = require('express');
// const cors = require('cors');


// // Esoteric Resources
// const errorHandler = require('./error-handlers/500.js');
// const notFound = require('./error-handlers/404.js');
// const authRoutes = require('./auth/routes.js');

// // Prepare the express app
// const app = express();

// // App Level MW
// app.use(cors());

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use(authRoutes);

// // Catchalls
// app.use(notFound);
// app.use(errorHandler);

// module.exports = {
//   server: app,
//   start: (port) => {
//     app.listen(port, () => {
//       console.log(`Server Up on ${port}`);
//     });
//   },
// };
