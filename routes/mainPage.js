var express = require('express');
var router = express.Router();

class Project {
  constructor(title, description, owner,id,users,messages) {
    this.title = title
    this.description = description
    this.owner = owner
    this.id = id
    this.users = users
    this.messages = messages
  }
  addMessage(text,name,date){
    this.messages.push(new Message(text,name,date))
  }
  addUser(id){
    this.users.push(id)
  }
}

class Message {
  constructor(text,name,date) {
    this.text = text
    this.name = name
    this.date = date
  }
}
var usersA = [0,1];
var usersB = [2,3];
const messages = [];
messages.push(new Message("hey guys","Adam","11-20"))
messages.push(new Message("go away nerd","Iain","11-21"))
messages.push(new Message("Iain lad cmon dont be rude","vitto","11-21"))
messages.push(new Message("I chase my shots with beeer","Adam","11-22"))
const projects = [];
projects.push(new Project("Bridge Burning","Let's burn as many bridges as we can!","Donald Trump",0,usersA,messages));
projects.push(new Project("basket weaving","I love making baskets","Mike Mulvaney",1,usersA,messages));
projects.push(new Project("Impeachment hearing","Lets take Trump DOWN","Shifty Schiff",2,usersB,messages));

class User {
  constructor(name,id) {
    this.name = name
    this.id = id
  }
}
const users = [];
users.push(new User("Adam",0))
users.push(new User("Iain",1))
users.push(new User("Vitto",2))
users.push(new User("Charles",3))

router.all('/*', (req, res, next)=>{

  req.app.locals.layout = 'home';
  next();

});

router.get('/', function(req, res, next) {
  res.render('mainPage', {
    projects: projects,
    search: ""
  });
});
router.get('/new', function(req, res, next) {
  res.render('newProject',{
    projCount: projects.length
  });
});

router.get('/:id', function(req, res, next) {
  id = req.params.id
  if(projects[id].users.indexOf(users[0].id)==-1) {//user isn't part of the project, users[0] is placeholder for active user
    res.render('projectView', {
      projects: projects,
      id: id,
      users: users
    });
  }
  else {
    res.render('projectAccess', { //else user is part of project
      projects: projects,
      id: id,
      users: users
    });
  }

});

router.post('/', (req, res) => {
  const search = req.body.search
  res.render('mainPage',{
    projects: projects,
    search: search
  });
})

router.post('/:id/message', (req, res) => {
  const id = req.params.id
  const msg = req.body.message
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  projects[id].addMessage(msg,users[0].name,date)
  res.redirect('/mainPage/' + id)
})

router.post('/:id/join', (req, res) => {
  const id = req.params.id
  projects[id].addUser(users[0].id)
  res.redirect('/mainPage/' + id)
})

router.post('/:id', (req, res) => {
  const id = req.params.id
  const title = req.body.title
  const description = req.body.description
  projects.push(new Project(title,description,users[0],id,[users[0].id],[]))
  console.log(id)
  res.redirect('/mainPage/' + id)
})


module.exports = router;
