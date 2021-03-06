const express = require('express');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash
    })
    user.save().then(result => {
      res.status(200).json({
        message: 'User Created',
        result: result
      });
    })
      .catch(err => {
        res.status(500).json({
          message : 'Invalid Authentication Credentials'
        })
      })
  })

})


router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: 'User Not Exists',
        })
      }

      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    }).then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Wrong Password..Authentication Failed '
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        'secret_this_should_be_longer',
        { expiresIn: "1h" }
      );
      res.status(200).json({
        message: '',
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      })

    })
    .catch(err => {
      return res.status(401).json({
        message: 'Authentication Failed'
      })
    })
})

module.exports = router;
