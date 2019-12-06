const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CommentSchema = new Schema({

  // Starting to define our schema here.
  user: {

    type: Schema.Types.ObjectId,
    ref: 'users'

  },

  body: {

    type: String,
    required: true

  },

  date: {

    type: Date,
    default: Date.now()
  }

});
// This is going too be the name for our model:
module.exports = mongoose.model('comments', CommentSchema);
