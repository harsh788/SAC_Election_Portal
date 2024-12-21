#! /usr/bin/env node
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const winstonlogger = require('./logger');
const mongoose = require('mongoose');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dashboardRouter = require('./routes/dashboard');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use((req, res, next) => {
  winstonlogger.info(`${req.method} ${req.url}`);
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dashboard', dashboardRouter);

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

// Setup mongoose connection
mongoose.set("strictQuery", false);
// const mongoDB = "mongodb://mongo_container:27017/myDB";
const mongoDB = "mongodb://localhost:27017/myDB";


main().catch((err) => console.log(err));
async function main() {
  winstonlogger.info("Connecting to MongoDB");
  try {
    await mongoose.connect(mongoDB);
    winstonlogger.info("Connected to MongoDB");
  } catch (error) {
    winstonlogger.error(error);
  }
  // await mongoose.connect(mongoDB);
}

module.exports = app;
