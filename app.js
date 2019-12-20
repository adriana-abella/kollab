var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const sessions = require('express-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mainRouter = require('./routes/mainPage')

var app = express();

app.use(bodyParser.json());

app.set('trust proxy', 1);
app.use(sessions({
  name: 'sid',
  secret: 'topsecret',
  resave: false,
  
  saveUninitialized: false,
  cookie: {
    maxAge: 86400000,
    sameSite: true,
    secure: false
  }
}));

mongoose.connect('mongodb://localhost/3000');
mongoose.Promise = global.Promise;
let db = mongoose.connection;

//Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

db.on('error', function(err){
  console.log(err);
});

// conncect to mongodb
//mongoose.connect('mongodb://localhost/kollabdb');
//mongoose.Promise = global.Promise;

//app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/mainPage', mainRouter);

function loginRequired(req, res, next) {
  if (!req.sessions.user) {
    return res.status(401).render('/users/login')
  }
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
