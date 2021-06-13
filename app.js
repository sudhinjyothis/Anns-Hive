var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require("express-handlebars")
var fileUpload = require("express-fileupload")
var db = require("./config/connection")
require('dotenv').config()
var Render = require('./routes/render');
var api = require('./routes/api');
var app = express();
var session = require("express-session")

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine("hbs", hbs({
  extname: "hbs",
  defaultLayout: "layout",
  layoutDir: __dirname + "/views/layouts/",
  partialsDir: __dirname + "/views/partials/"
}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload())
app.use(session({ secret: "de24983a7daf02e8b2fdfba6bd4a8ab4f9ade8bb7c32196bac2444915fece24372c7f6ab7e49a49e8f1f520431a684cb55ccfc4317545579ec3b07129e719d41", cookie: { maxAge: 604800000 } }))
db.connect((err) => {
  if (err) console.log("connection error" + err)
  else console.log("connection successfull to port 27017");
})
app.use('/', Render);
app.use('/api', api)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
