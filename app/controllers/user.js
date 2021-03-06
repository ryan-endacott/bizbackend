var db = require('../db'),
  User = db.User,
  errors = require('../errors'),
  badRequest = errors.badRequestError,
  loginUnauthorizedError = errors.loginUnauthorizedError;

exports.registerOrGetToken = function(req, res) {

  User.findOne({ email: req.body.user.email }, function(err, user) {
    if (err) return badRequest(err);

    if (!user) { // create new user if none found with email

      var user = new User(req.body.user);
      user.save(function(err, user) {
        if (err) return badRequest(err, res);
        res.json(user.toObject()); // Send toObject to include token
      });

    } else { // Otherwise, check if the password matches
      user.comparePassword(req.body.user.password, function(err, isMatch) {
        if (err) return badRequest(err);
        if (isMatch) {
          res.json(user.toObject()); // Send toObject to include token
        }
        else {
          return loginUnauthorizedError(null, res); // no match
        }
      });
    }
  });

};

exports.update = function(req, res) {
  if (req.body.user) { // If user info supplied, update
    req.user.set(req.body.user).save(function(err, user) {
      if (err) return badRequest(err, res);
      res.json(user);
    });

  } else { // Otherwise, just return user info
    res.json(req.user);
  }
};

