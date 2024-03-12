'use strict';

const { users } = require('../../schemas/index-models');

module.exports = async (req, res, next) => {

  try {

    if (!req.headers.authorization) { _authError(); }

    const token = req.headers.authorization.split(' ').pop();
    const validUser = await users.authenticateToken(token);
    if (!validUser) { return _authError(res); }

    req.user = validUser;
    req.token = validUser.token;
    next();

  } catch (e) {
    _authError(res);
  }

  function _authError() {
    res.status(403).json({ message: 'Invalid Login'});
  }
};
