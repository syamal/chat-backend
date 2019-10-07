const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
var util = require('util');


// User Model
const User = require('../models/user');


// Register Controller

exports.postRegister = (req, res) => {
  const { username, password } = req.body;

  // Simple validation
  if(!username || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  // Check for existing user
  User.findOne({ username })
    .then(user => {
      if(user) return res.status(400).json({ msg: 'User already exists' });

      const newUser = new User({
        username,
        password
      });

      // Create salt & hash
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) throw err;
          newUser.password = hash;
          newUser.save()
            .then(user => {
              jwt.sign(
                { id: user.id },
                config.get('jwtSecret'),
                { expiresIn: 3600 },
                (err, token) => {
                  if(err) throw err;
                  res.json({
                    token,
                    user: {
                      id: user.id,
                      username: user.username
                    }
                  });
                }
              )
            });
        })
      })
    })
};

// Login * Public Route

exports.postLogin = (req, res) => {
  
  const { username, password } = req.body;

  // Simple validation
  if(!username || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  // Check for existing user
  User.findOne({ username })
    .then(user => {
      if(!user) return res.status(400).json({ msg: 'User Does not exist' });

      // Validate password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

          jwt.sign(
            { id: user.id },
            config.get('jwtSecret'),
            { expiresIn: 3600 },
            (err, token) => {
              if(err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                  username: user.username
                }
              });
            }
          )
        })
    })
};

// Get User Details * Proptected route

exports.getUser = (req, res) =>  {
  const { user_id } = req.body;

  User.findById(user.id)
    .select('-password')
    .then(user => res.json(user));
};

// Get All users  * Proptected route

exports.getAll = (req, res) =>  {

  User.find()
    .select('-password')
    .then(users => res.json(users));
};

// Get All users except the requesting user  * Proptected route

exports.getAllExcpetOne = async (req, res) =>  {
  //let user_id = req.user.id;

  const { user_id } = req.body;

  let users = await User.find({_id: { $nin: user_id } })
    .select('-password');


  return res.json(users);    

};

