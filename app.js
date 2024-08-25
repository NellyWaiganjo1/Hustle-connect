const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const createError = require('http-errors');
require('dotenv').config(); // Ensure dotenv is configured to handle environment variables

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const serviceRouter = require('./routes/serviceRoutes'); // Import the service routes

const app = express();

// Connect to MongoDB
connectDB(); // If using Mongoose, this should be called in your db configuration file
// Alternatively, you can use mongoose.connect directly here if not using connectDB

// Middleware
app.use(logger('dev')); // Logger middleware for development
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: false })); // To parse URL-encoded bodies
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRouter); // Add the service routes under the /api/services path

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Set the port to listen on
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
