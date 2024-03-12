'use strict';

const base64 = require('base-64');
const { users } = require('../../schemas/index-models');

module.exports = async (req, res, next) => {
  
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Basic')) {
    throw new Error('Missing or invalid authorization header');
  }

  let basicHeaderParts = req.headers.authorization.split(' '); // ['Basic', 'am9objpmb28=']
  let encodedString = basicHeaderParts.pop(); // pop 'Basic' from array now is 'am9objpmb28='
  let decodedString = base64.decode(encodedString); // "username:password"
  let [username, pass] = decodedString.split(':'); // username, password

  try {
    req.user = await users.authenticateBasic(username, pass);
    next();
  } catch (e) {
    console.error(e);
    _authError();
  }

  function _authError() {
    res.status(403).json({ message: 'Invalid Login'});
  }

};
