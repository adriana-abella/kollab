const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

//User Schema

const UserSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});

UserSchema.methods.generateAuthToken = function()
{
  const token = jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin
    },
      'topsecret');
  return token;
}

const User = module.exports = mongoose.model('User', UserSchema);

module.exports = User;
