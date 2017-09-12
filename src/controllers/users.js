const { Users } = require('../models/models');

exports.getAllUsers = (req, res, next) => {

  // Find all users
  Users.find()
    .then((users) => {
      if (users.length < 1) 
        return next({ status: 404, message: 'No Users Found' });

      return res.status(200).json({ users });
    })
    .catch(next);
};

exports.getUser = (req, res, next) => {
  // get article id
  const { username } = req.params;

  // find user that matches username
  Users.findOne({ username: username })
    .then((user) => {

      res.status(200).json({ user });
    })
    .catch(next);
};