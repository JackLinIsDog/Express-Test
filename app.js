require('./routes/item');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')

var indexRouter = require('./routes/index');// home page 接口
var usersRouter = require('./routes/users');// 用户接口
var userRouter = require('./routes/user');// 用户接口
var mail = require('./routes/mail');// 用户接口
var app = express();
//定时任务，每天发送邮件
var cronJob = require("cron").CronJob;
new cronJob('0 18 11 * * *', function () {
  console.log("renwu");
  mail.sendMail();
}, null, true, 'Asia/Chongqing');


app.all('*', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');  
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');  
  // res.setHeader("Content-Type", "application/json;charset=utf-8"); 
  next();
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());//
app.use(bodyParser.urlencoded({ extended: false}));

app.use('/', indexRouter);// 在app中注册routes该接口
app.use('/users', usersRouter);// 在app中注册users接口
app.use('/user', userRouter);

// parse application/json
app.use(bodyParser.json());
// 创建 application/x-www-form-urlencoded 编码解析
app.use(bodyParser.urlencoded({ extended: false }));
// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  next(createError(404));
//});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(8000);
module.exports = app;
