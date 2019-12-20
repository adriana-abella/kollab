var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user')
const Project = require('../models/project')
const Comment = require('../models/comment')

// class Project {
//   constructor(title, description, owner,id,users,messages) {
//     this.title = title
//     this.description = description
//     this.owner = owner
//     this.id = id
//     this.users = users
//     this.messages = messages
//   }
//   addMessage(text,name,date){
//     this.messages.push(new Message(text,name,date))
//   }
//   addUser(id){
//     this.users.push(id)
//   }
// }

// class Message {
//   constructor(text,name,date) {
//     this.text = text
//     this.name = name
//     this.date = date
//   }
// }
// var usersA = [0,1];
// var usersB = [2,3];
// const messages = [];
// messages.push(new Message("hey guys","Adam","11-20"))
// messages.push(new Message("Let's get started on our project","Iain","11-21"))
// messages.push(new Message("Ok when's everyone available to meet up?","vitto","11-21"))
// messages.push(new Message("Tomorrow should work.","Adam","11-22"))
// const projects = [];
// projects.push(new Project("Web Application","Let's build a webapp that helps people find groups for projects.","John Doe",0,usersA,messages));
// projects.push(new Project("Film","We will be recording and editing a short film about technology.","Jane Smith",1,usersA,messages));
// projects.push(new Project("Sports Science","Researching how diet affects athletic performance.","Shifty Schiff",2,usersB,messages));

// class User {
//   constructor(name,id) {
//     this.name = name
//     this.id = id
//   }
// }
// const users = [];
// users.push(new User("Adam",0))
// users.push(new User("Iain",1))
// users.push(new User("Vitto",2))
// users.push(new User("Charles",3))

router.all('/*', auth, (req, res, next)=>{

  req.app.locals.layout = 'home';
  next();

});

router.get('/', function(req, res, next) {
  Project.find({}).then(projects=>
  {
    res.render('mainPage', {
      projects: projects,
      search: ""
    });
  });
});
router.get('/new', function(req, res, next) {
  Project.findOne({}).then(projects=>
  {
    res.render('newProject')
  });
});

router.get('/:id', function(req, res, next) {
  Project.findOne({_id: req.params.id}).then(project=>
  {
    User.findOne({_id: project.owner}).then(owner =>
    {
      User.find({_id: {$in: project.users}}).then(found=>
        {
          Comment.find({_id: {$in: project.comments}}).then(comms => 
            {

              console.log(comms)
      if(project.users.includes(req.session.user)) {//user isn't part of the project, users[0] is placeholder for active user

      res.render('projectAccess', { //else user is part of project
        project: project,
        owner: owner,
        users: found,
        comments: comms
      });
    }
    else {
      res.render('projectView', {
        project: project,
        owner: owner,
        users: found
      });
    }
            })
        })
    });
  })
});

router.post('/', (req, res) => {
  Project.find({}).then(projects=>
  {
    const search = req.body.search
    res.render('mainPage', {
      projects: projects,
      search: search
    });
  });
});

router.post('/:id/message', (req, res) => {
  Project.findOne({_id: req.params.id}).then(proj =>
  {
    User.findOne({_id: req.session.user}).then(currentUser =>
    {
      const newComment = new Comment(
        {
          user: currentUser,
          username: currentUser.name,
          body: req.body.message,
          date: new Date()
        }
      )
      proj.comments.push(newComment);
      proj.save().then(savedproj=>
        {
          newComment.save().then(savedComment=>
            {
              res.redirect('/mainPage/' + req.params.id)
            })
        })
    })
  });
})

router.post('/:id/join', (req, res) => {
  Project.findOne({_id: req.params.id}).then(proj=>
    {
      User.findOne({_id: req.session.user}).then(currentUser =>
      {
        proj.users.push(currentUser)
      proj.save().then(savedProj=>
        {
          res.redirect('/mainPage/' +req.params.id)
        });
      })
    });
});

router.post('/create', (req, res) => {

  User.findOne({_id: req.session.user}).then(currentUser =>
  {
    const newProject = new Project(
      {
        owner: currentUser._id,
        ownername: currentUser.name,
        title: req.body.title,
        description: req.body.description,
      });
    newProject.users.push(currentUser)
    newProject.save().then(savedProject =>
    {
      console.log(savedProject);
      res.redirect('/mainPage/' + savedProject.id)
    }).catch(error =>
      {
        console.log(error.errors, 'Could not save post!');
      });
  })
});


module.exports = router;
