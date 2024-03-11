'use strict';

module.exports = (capability) => {

  return (req, res, next) => {

    try {
      if (req.user && req.user.capabilities && req.user.capabilities.includes(capability)) {
        next();
      }
      else {
        // Respond with 403 Forbidden and an error message if the capability is not present
        res.status(403).json({ message: 'Access Denied' });
      }
    } catch (error) {
      // Respond with 401 Forbidden and an error message
      res.status(401).json({ message: 'Invalid Login' });
    }
  };

};
