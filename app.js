var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db = require("./db")
db.create();
var indexRouter = require('./routes/index');
var messagesRouter = require('./routes/messages');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
  if(req.url.startsWith("/allow")) {next(); return;}
  if(req.url.startsWith("/deny")) {next(); return;}
  if(req.url.startsWith("/whitelist")) {next(); return;}

  let pin = req.headers["pin"]
  if(pin == undefined) {res.send("UNAUTHORIZED"); return}
  if(!(await checkPin(pin))) {res.send("UNAUTHORIZED"); return}

  next()
})
async function checkPin(pin){
  let list = await db.whitelist();
  for(let i=0; i<=list.length-1; i++){
    if(list[i].pin == pin) return true;
  }
  return false;

}
app.use('/', indexRouter);
app.use('/message', messagesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    msg : err.message,
    code : err.status
  });
});

module.exports = app;
