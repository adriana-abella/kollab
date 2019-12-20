const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class Message {
  constructor(text,name,date) {
    this.text = text
    this.name = name
    this.date = date
  }
}

const ProjectSchema = mongoose.Schema({
    owner:{
        type: Schema.Types.ObjectId
    },
    ownername:{
        type: String
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    comments: [{

        type: Schema.Types.ObjectId

    }],
    users:[{
        type: Schema.Types.ObjectId, //what's the userID type??
    }]
}, {usePushEach: true});

const Project = module.exports = mongoose.model('Project', ProjectSchema);

module.exports = Project;
