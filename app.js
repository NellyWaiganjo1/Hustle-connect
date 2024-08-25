var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
//var dotenv = require('dotenv'); // Import dotenv to handle environment variables (if needed)


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var serviceRouter = require('./routes/serviceRoutes'); // Import the service routes

var app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hustleconnectDB', { // Replace with your MongoDB URI
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// Use routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/services', serviceRouter); // Add the service routes under the /api/services path

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

// Set the port to listen on
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
