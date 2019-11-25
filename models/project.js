const mongoose = require('mongoose');

class Message {
  constructor(text,name,date) {
    this.text = text
    this.name = name
    this.date = date
  }
}

const ProjectSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    messages:{
        type: [Message],
        required: true
    }
    users:{
        type: [], //what's the userID type??
        required: true
    }
});

const Project = module.exports = mongoose.model('Project', ProjectSchema);

module.exports = Project;
