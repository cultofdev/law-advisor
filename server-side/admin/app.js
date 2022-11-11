var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('dotenv').config();

var usersRouter = require('./routes/users');

const db = require('./db/mongodb');

var app = express();

const cors = require('cors');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// cors settings
const corsSettings = {
  origin: '*',
  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE'
  ],
  allowedHeaders: [
    'Content-Type',
    'authorization'
  ]
}

app.use(cors(corsSettings));

app.use('/users', usersRouter);

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

db.connectToServer((err) => {
  if(err) {
    console.error(err);
    process.exit();
  }
});

module.exports = app;
