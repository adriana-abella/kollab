var express = require('express');
var router = express.Router();
const User = require('../models/user')
var bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');

router.get('/register', (req,res)=>{
  res.render('register');
});

router.post('/register', async (req,res)=>{
  let newUser = await User.findOne({email: req.body.email});
  if (newUser) return res.status(400).send('User already registered.');

  newUser = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });

  
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);
  await newUser.save().then(data => {
    res.status(302).redirect('/users/login');
  })
  .catch(err => {
    return next(err);
  });
  // | --------------
  // | REPLACED THIS 
  // | --------------
  // newUser.save()
  //        .then(data => {
  //          res.json(data);
  //        })
  //        .catch(err => {
  //          res.json({ message: err});
  //        });
  // bcrypt.genSalt(10, function(err, salt){
  //   bcrypt.hash(newUser.password, salt, function(err, hash){
  //     if(err) {
  //       return next(err);
  //     } else {
  //       res.status(302).redirect('/mainPage');
  //     }
  //   });
  // });
});

router.get('/login', (req, res)=>{
  res.render('login');
});

router.post('/login', async (req,res)=>{
  let user = await User.findOne({username: req.body.username});

  console.log(user);

  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = user.generateAuthToken();
  req.session.user = user._id;
  req.session.userToken = token;
  res.header('x-auth-token', token).redirect('/mainPage');
});

router.post('/logout',  (req, res) =>
{
    req.session.destroy(err =>
    {
        if (err)
        {
            res.redirect('/');
        }
        res.clearCookie('sid');
        res.redirect('/users/login');
    })
});


module.exports = router;
