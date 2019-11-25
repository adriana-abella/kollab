var express = require('express');
var router = express.Router();
const User = require('../models/user')
var bcrypt = require('bcryptjs');

router.get('/register', (req,res)=>{
  res.render('register');
});

router.post('/register', (req,res)=>{
  const newUser = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });

  newUser.save()
         .then(data => {
           res.json(data);
         })
         .catch(err => {
           res.json({ message: err});
         });
  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(newUser.password, salt, function(err, hash){
      if(err) {
        return next(err);
      } else {
        res.status(302).redirect('/mainPage');
      }
    });
  });
});


router.get('/login', (req,res)=>{
  res.send('this is the login page');
});

module.exports = router;
