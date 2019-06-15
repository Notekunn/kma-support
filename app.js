const createError = require('http-errors');
const express = require('express');
const app = express();
const sequelize = require("@config/sequelize");
require("@config/express")({app});
require("@config/router")({app});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

sequelize.authenticate();
// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
